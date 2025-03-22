import { inject, injectable } from '@needle-di/core';

import { SessionsRepository } from './session.repository';

@injectable()
export class SessionsService {
  constructor(private sessionsRepository = inject(SessionsRepository)) {}

  async findUserSessions(sessionId: string) {
    return this.sessionsRepository.findUserSessions(sessionId);
  }
}
