import { injectable } from '@needle-di/core';

import { PrismaRepository } from '../common/factories/prisma-repository.factory';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

type CreateVideoClubOptions = {
  name: string;
  userId: string;
};

type DeleteVideoClubOptions = {
  userId: string;
  videoClubId: string;
};

type GetOneDetailOptions = {
  search: {
    actors?: string;
    author?: string;
    genre?: string;
    title?: string;
  };
  userId: string;
  videoClubId: string;
};

type GetOneOptions = {
  userId: string;
  videoClubId: string;
};

/* -------------------------------------------------------------------------- */
/*                                 Repository                                 */
/* -------------------------------------------------------------------------- */
@injectable()
export class VideoClubsRepository extends PrismaRepository {
  async create({ name, userId }: CreateVideoClubOptions, db = this.prisma.db) {
    return db.videoClub.create({
      data: {
        inviteId: crypto.randomUUID(),
        name,
        users: {
          connect: { id: userId }
        },
        watchId: crypto.randomUUID()
      }
    });
  }

  async delete({ userId, videoClubId }: DeleteVideoClubOptions, db = this.prisma.db) {
    return db.videoClub.deleteMany({
      where: {
        id: videoClubId,
        users: { some: { id: userId } }
      }
    });
  }

  async getAllForUser(userId: string, db = this.prisma.db) {
    return db.videoClub.findMany({
      where: { users: { some: { id: userId } } }
    });
  }

  async getOne({ userId, videoClubId }: GetOneOptions, db = this.prisma.db) {
    return db.videoClub.findFirst({
      where: { id: videoClubId, users: { some: { id: userId } } }
    });
  }

  async getOneDetail({ search, userId, videoClubId }: GetOneDetailOptions, db = this.prisma.db) {
    return db.videoClub.findFirst({
      include: {
        videos: {
          include: {
            _count: {
              select: { comments: { where: { videoClubId: videoClubId } } }
            },
            ratings: { orderBy: { createdAt: 'asc' } }
          },
          orderBy: { releaseDate: 'desc' },
          where: {
            characters: search.actors
              ? {
                  some: { actor: { name: { contains: search.actors, mode: 'insensitive' } } }
                }
              : undefined,
            creators: search.author
              ? { some: { name: { contains: search.author, mode: 'insensitive' } } }
              : undefined,
            genres: search.genre
              ? { some: { name: { contains: search.genre, mode: 'insensitive' } } }
              : undefined,
            OR: search.title
              ? [
                  { title: { contains: search.title, mode: 'insensitive' } },
                  { originalTitle: { contains: search.title, mode: 'insensitive' } }
                ]
              : undefined
          }
        }
      },
      where: { id: videoClubId, users: { some: { id: userId } } }
    });
  }
}
