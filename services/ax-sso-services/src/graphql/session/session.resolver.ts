import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { SessionService } from './session.service'
import { SessionType } from './session.type'

@Resolver(() => SessionType)
export class SessionResolver {
  constructor(private readonly sessionService: SessionService) {}

  @Query(() => SessionType, { nullable: true, description: 'Returns the session by token, or null if missing/expired.' })
  session(@Args('token') token: string): Promise<SessionType | null> {
    return this.sessionService.findByToken(token)
  }

  @Mutation(() => Boolean, { description: 'Invalidates the session with the given token. Returns true if a session was removed.' })
  removeSession(@Args('token') token: string): Promise<boolean> {
    return this.sessionService.removeByToken(token)
  }
}
