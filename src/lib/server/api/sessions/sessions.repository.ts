import { injectable } from '@needle-di/core';

import { PrismaRepository } from '../common/factories/prisma-repository.factory';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                 Repository                                 */
/* -------------------------------------------------------------------------- */
@injectable()
export class SessionsRepository extends PrismaRepository {
  async findUserSessions(sessionId: string, db = this.prisma.db) {
    const dbSession = await db.session.findUnique({
      include: { user: true },
      where: {
        expires: { gt: new Date() },
        sessionToken: sessionId
      }
    });

    return dbSession;
  }
}
