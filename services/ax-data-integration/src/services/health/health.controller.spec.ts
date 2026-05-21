import { ServiceUnavailableException } from '@nestjs/common'
import type { MongoClient } from 'mongodb'

import { HealthController } from './health.controller'

interface FakeMongo {
  db(): { admin(): { ping(): Promise<void> } }
}

function buildController(pingImpl: () => Promise<void>): HealthController {
  const fake: FakeMongo = {
    db: () => ({ admin: () => ({ ping: pingImpl }) }),
  }
  return new HealthController(fake as unknown as MongoClient)
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

  describe('readiness', () => {
    it('reports connected when ping resolves', async () => {
      const controller = buildController(() => Promise.resolve())
      await expect(controller.readiness()).resolves.toEqual({ status: 'ready', mongo: 'connected' })
    })

    it('throws 503 with disconnected payload when ping rejects', async () => {
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
      // The controller's catch block calls String(err) when the rejection is not an Error.
      const controller = buildController(() => {
        // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
        return Promise.reject('totally-broken')
      })
      await expect(controller.readiness()).rejects.toMatchObject({
        response: { error: 'totally-broken' },
      })
    })
  })
})
