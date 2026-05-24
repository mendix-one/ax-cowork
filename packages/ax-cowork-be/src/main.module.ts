import { Module } from '@nestjs/common'
import { SecurityModule } from './acore/security/security.module'
import { ConfigModule } from './acore/config/config.module'
import { GatewayModule } from './gateway/gateway.module'
import { WebappModule } from './webapp/webapp.module'
import { WebhookModule } from './webhook/webhook.module'
import { WebsocketModule } from './websocket/websocket.module'
import { WorkersModule } from './workers/workers.module'

@Module({
  imports: [ConfigModule, SecurityModule, GatewayModule, WebhookModule, WebsocketModule, WorkersModule, WebappModule],
})
export class MainModule {}
