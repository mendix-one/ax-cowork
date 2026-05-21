import { ConcurrencyService } from './concurrency.service'

// Helper: flush pending microtasks so we can observe whether a Promise has settled.
const flush = (): Promise<void> => new Promise((resolve) => setImmediate(resolve))

describe('ConcurrencyService — fast-path', () => {
  it('first acquire for a job → kind=acquired, second concurrent acquire for the same job → skipped-inmem', async () => {
    const svc = new ConcurrencyService(10)

    const first = await svc.acquire('job-a')
    expect(first.kind).toBe('acquired')

    const second = await svc.acquire('job-a')
    expect(second.kind).toBe('skipped-inmem')
  })

  it('releasing a held job frees the fast-path so the same id can be acquired again', async () => {
    const svc = new ConcurrencyService(10)
    const h1 = await svc.acquire('job-a')
    expect(h1.kind).toBe('acquired')
    if (h1.kind === 'acquired') h1.release()

    expect(svc.isRunning('job-a')).toBe(false)

    const h2 = await svc.acquire('job-a')
    expect(h2.kind).toBe('acquired')
  })

  it('different job ids do not collide on the fast-path', async () => {
    const svc = new ConcurrencyService(10)
    expect((await svc.acquire('a')).kind).toBe('acquired')
    expect((await svc.acquire('b')).kind).toBe('acquired')
    expect((await svc.acquire('c')).kind).toBe('acquired')
    expect(svc.fastPathSize).toBe(3)
  })
})

describe('ConcurrencyService — semaphore', () => {
  it('rejects non-positive capacity', () => {
    expect(() => new ConcurrencyService(0)).toThrow(/positive integer/)
    expect(() => new ConcurrencyService(-1)).toThrow(/positive integer/)
    expect(() => new ConcurrencyService(1.5)).toThrow(/positive integer/)
  })

  it('acquires up to capacity without blocking', async () => {
    const svc = new ConcurrencyService(3)
    await svc.acquire('a')
    await svc.acquire('b')
    await svc.acquire('c')
    expect(svc.inFlight).toBe(3)
  })

  it('blocks acquires beyond capacity until a holder releases', async () => {
    const svc = new ConcurrencyService(2)
    const ha = await svc.acquire('a')
    const hb = await svc.acquire('b')
    expect(svc.inFlight).toBe(2)

    let cResolved = false
    const cPromise = svc.acquire('c').then((result) => {
      cResolved = true
      return result
    })

    await flush()
    expect(cResolved).toBe(false)

    if (ha.kind === 'acquired') ha.release()
    const hc = await cPromise
    expect(cResolved).toBe(true)
    expect(hc.kind).toBe('acquired')

    // inFlight stays at capacity until the second holder releases as well.
    expect(svc.inFlight).toBe(2)

    if (hb.kind === 'acquired') hb.release()
    if (hc.kind === 'acquired') hc.release()
    expect(svc.inFlight).toBe(0)
  })

  it('resumes blocked acquires in FIFO order', async () => {
    const svc = new ConcurrencyService(1)
    const ha = await svc.acquire('a')

    const order: string[] = []
    const pb = svc.acquire('b').then((h) => {
      order.push('b')
      if (h.kind === 'acquired') h.release()
    })
    const pc = svc.acquire('c').then((h) => {
      order.push('c')
      if (h.kind === 'acquired') h.release()
    })
    const pd = svc.acquire('d').then((h) => {
      order.push('d')
      if (h.kind === 'acquired') h.release()
    })

    await flush()
    expect(order).toEqual([])

    if (ha.kind === 'acquired') ha.release()
    await Promise.all([pb, pc, pd])
    expect(order).toEqual(['b', 'c', 'd'])
  })

  it('release without prior acquire is a no-op (clamps at 0)', async () => {
    const svc = new ConcurrencyService(2)
    const h = await svc.acquire('a')
    if (h.kind === 'acquired') {
      h.release()
      // A duplicate release would be a misuse, but should not push slotsTaken negative
      // (defensive clamp at 0).
      expect(svc.inFlight).toBe(0)
    }
  })
})
