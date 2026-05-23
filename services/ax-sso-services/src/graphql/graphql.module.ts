import { join } from 'node:path'
import { Module } from '@nestjs/common'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { ApolloDriver } from '@nestjs/apollo'
import type { ApolloDriverConfig } from '@nestjs/apollo'
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql'

import { ManageResolver } from './manage/manage.resolver'
import { ManageService } from './manage/manage.service'
import { ProfileResolver } from './profile/profile.resolver'
import { ProfileService } from './profile/profile.service'

@Module({
  imports: [
    NestGraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // Code-first: the schema file is generated from decorators on boot.
      autoSchemaFile: join(process.cwd(), 'schema.gql'),
      sortSchema: true,
      // Make the schema discoverable to the Sandbox UI.
      introspection: true,
      // Disable the old GraphQL Playground in favor of Apollo Sandbox below.
      playground: false,
      // Surfaces the underlying HTTP request to resolvers and to the global ApiKeyGuard
      // (which falls back to GqlExecutionContext when the execution type is `graphql`).
      context: ({ req }: { req: unknown }) => ({ req }),
      // Embeds Apollo Sandbox directly on GET /graphql — no external redirect, no Studio account.
      // Set `embed: false` to instead redirect to studio.apollographql.com/sandbox.
      plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true, includeCookies: false })],
    }),
  ],
  providers: [ProfileService, ProfileResolver, ManageService, ManageResolver],
})
export class GraphQLModule {}
