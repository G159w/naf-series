import { inject, injectable } from '@needle-di/core';

import { SessionsRepository } from './sessions.repository';

@injectable()
export class SessionsService {
  constructor(private sessionsRepository = inject(SessionsRepository)) {}

  async findUserSessions(sessionId: string) {
    return this.sessionsRepository.findUserSessions(sessionId);
  }
}
