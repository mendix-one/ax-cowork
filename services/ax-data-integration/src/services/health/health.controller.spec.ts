import { ServiceUnavailableException } from '@nestjs/common'
import type { Db, IndexDescriptionInfo, MongoClient } from 'mongodb'

import { CRITICAL_INDEX_SPECS } from '../../acore/mongo/indexes'
import { HealthController } from './health.controller'

interface FakeMongo {
  db(): { admin(): { ping(): Promise<void> } }
}

type FakeIndexes = Record<string, IndexDescriptionInfo[]>

function buildController(pingImpl: () => Promise<void>, indexesByCollection: FakeIndexes = allCriticalPresent()): HealthController {
  const fakeClient: FakeMongo = {
    db: () => ({ admin: () => ({ ping: pingImpl }) }),
  }
  const fakeDb = {
    collection: (name: string) => ({
      indexes: () => Promise.resolve(indexesByCollection[name] ?? []),
    }),
  } as unknown as Db
  return new HealthController(fakeClient as unknown as MongoClient, fakeDb)
}

// Helper: returns a fake-indexes map where every critical index is present.
function allCriticalPresent(): FakeIndexes {
  const map: FakeIndexes = {}
  for (const spec of CRITICAL_INDEX_SPECS) {
    const list = map[spec.collection] ?? []
    list.push({ v: 2, key: spec.key, name: spec.name })
    map[spec.collection] = list
  }
  return map
}

describe('HealthController', () => {
  describe('liveness', () => {
    it('returns ok without hitting Mongo', () => {
      // Throwing inside ping() ensures liveness is genuinely independent of Mongo.
      const pingExploded = jest.fn(() => Promise.reject(new Error('mongo down')))
      const controller = buildController(pingExploded)
      expect(controller.liveness()).toEqual({ status: 'ok' })
      expect(pingExploded).not.toHaveBeenCalled()
    })
  })

  describe('readiness — Mongo layer', () => {
    it('reports connected + indexes ok when ping resolves and every critical index exists', async () => {
      const controller = buildController(() => Promise.resolve())
      await expect(controller.readiness()).resolves.toEqual({ status: 'ready', mongo: 'connected', indexes: 'ok' })
    })

    it('throws 503 with disconnected payload when ping rejects (does NOT touch indexes)', async () => {
      const controller = buildController(() => Promise.reject(new Error('ECONNREFUSED 127.0.0.1:27017')))
      await expect(controller.readiness()).rejects.toMatchObject({
        constructor: ServiceUnavailableException,
        response: {
          status: 'not-ready',
          mongo: 'disconnected',
          error: 'ECONNREFUSED 127.0.0.1:27017',
        },
      })
    })

    it('coerces non-Error rejections to strings in the error payload', async () => {
      const controller = buildController(() => {
        // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
        return Promise.reject('totally-broken')
      })
      await expect(controller.readiness()).rejects.toMatchObject({
        response: { error: 'totally-broken' },
      })
    })
  })

  describe('readiness — critical-index layer (T2-A02)', () => {
    it('throws 503 with the missing index name when running_lock_unique is absent', async () => {
      // Drop just the partial-unique sync_runs lock — everything else present.
      const indexes = allCriticalPresent()
      indexes.sync_runs = (indexes.sync_runs ?? []).filter((i) => i.name !== 'running_lock_unique')
      const controller = buildController(() => Promise.resolve(), indexes)

      await expect(controller.readiness()).rejects.toMatchObject({
        constructor: ServiceUnavailableException,
        response: {
          status: 'not-ready',
          mongo: 'connected',
          indexes: 'missing',
          missing: ['sync_runs.running_lock_unique'],
        },
      })
    })

    it('reports every missing critical index in one response (not just the first)', async () => {
      const controller = buildController(() => Promise.resolve(), {}) // empty → all critical missing
      await expect(controller.readiness()).rejects.toMatchObject({
        response: {
          status: 'not-ready',
          mongo: 'connected',
          indexes: 'missing',
          missing: expect.arrayContaining(CRITICAL_INDEX_SPECS.map((s) => `${s.collection}.${s.name}`)) as unknown,
        },
      })
    })

    it('treats NamespaceNotFound (collection does not exist) as "every critical index missing for that collection"', async () => {
      // The findMissingCriticalIndexes helper catches code:26 specifically. Simulate it by
      // making sync_runs throw NamespaceNotFound while other collections have their indexes.
      const indexes = allCriticalPresent()
      const fakeDb = {
        collection: (name: string) => ({
          indexes: () => {
            if (name === 'sync_runs') {
              const err = Object.assign(new Error('ns does not exist'), { code: 26 })
              return Promise.reject(err)
            }
            return Promise.resolve(indexes[name] ?? [])
          },
        }),
      } as unknown as Db
      const fakeClient = { db: () => ({ admin: () => ({ ping: () => Promise.resolve() }) }) } as unknown as MongoClient
      const controller = new HealthController(fakeClient, fakeDb)

      await expect(controller.readiness()).rejects.toMatchObject({
        response: {
          missing: ['sync_runs.running_lock_unique'],
        },
      })
    })
  })
})
