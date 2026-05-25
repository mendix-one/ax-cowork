import { Global, Logger, Module } from '@nestjs/common'
import { collectDefaultMetrics, Registry } from 'prom-client'

import { MetricsController } from './metrics.controller'
import { MetricsService } from './metrics.service'
import { PROMETHEUS_REGISTRY } from './metrics.constants'

const logger = new Logger('MetricsModule')

/**
 * T2-A08 — wires a singleton prom-client Registry, collects Node.js default process
 * metrics (memory, CPU, event-loop lag, GC), and exposes `/metrics` via {@link MetricsController}.
 *
 * Global so `SyncExecutorService` (and future workers in T2-B / T2-C) can inject
 * `MetricsService` without re-importing this module per-feature.
 */
@Global()
@Module({
  providers: [
    {
      provide: PROMETHEUS_REGISTRY,
      useFactory: (): Registry => {
        const registry = new Registry()
        registry.setDefaultLabels({ service: 'ax-data-integration' })
        collectDefaultMetrics({ register: registry })
        logger.log('Prometheus registry initialized with default Node.js process metrics')
        return registry
      },
    },
    MetricsService,
  ],
  controllers: [MetricsController],
  exports: [PROMETHEUS_REGISTRY, MetricsService],
})
export class MetricsModule {}
