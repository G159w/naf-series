import type { DBMovieMoviesDetail } from '$lib/types';
import type { VideoType } from '@prisma/client';

import { injectable } from '@needle-di/core';

import { PrismaRepository } from '../common/factories/prisma-repository.factory';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

type AddVideoToVideoClubOptions = {
  videoClubId: string;
  videoId: string;
};

type CreateCommentOptions = {
  content: string;
  userId: string;
  videoClubId: string;
  videoId: string;
};

type CreateVideoOptions = DBMovieMoviesDetail & {
  title: string;
  type: VideoType;
};

type GetBaseVideoOptions = {
  videoClubId: string;
  videoId: string;
};

type GetOneOptions = {
  videoClubId: string;
  videoId: string;
};

type RemoveVideoFromVideoClubOptions = {
  videoClubId: string;
  videoId: string;
};

type UpsertRatingOptions = {
  rating: number;
  userId: string;
  videoClubId: string;
  videoId: string;
};

/* -------------------------------------------------------------------------- */
/*                                 Repository                                 */
/* -------------------------------------------------------------------------- */
@injectable()
export class VideoRepository extends PrismaRepository {
  async addVideoToVideoClub(options: AddVideoToVideoClubOptions, db = this.prisma.db) {
    return db.video.update({
      data: { videoClubs: { connect: { id: options.videoClubId } } },
      where: { id: options.videoId }
    });
  }

  async all(videoClubId: string, db = this.prisma.db) {
    return db.video.findMany({ where: { videoClubs: { some: { id: videoClubId } } } });
  }

  async createComment(options: CreateCommentOptions, db = this.prisma.db) {
    return db.comment.create({
      data: {
        content: options.content,
        user: { connect: { id: options.userId } },
        video: { connect: { id: options.videoId } },
        videoClub: { connect: { id: options.videoClubId } }
      }
    });
  }

  async createOrUpdate(data: CreateVideoOptions, db = this.prisma.db) {
    const video = await db.video.upsert({
      create: {
        adult: data.adult,
        backdropPath: data.backdrop_path,
        budget: data.budget,
        creators: {
          connectOrCreate: data.credits.crew.map((creator) => ({
            create: {
              imgUrl: creator.profile_path,
              name: creator.name,
              popularity: creator.popularity
            },
            where: { name: creator.name }
          }))
        },
        genres: {
          connectOrCreate: data.genres.map((genre) => ({
            create: { name: genre.name },
            where: { name: genre.name }
          }))
        },
        imdbId: data.imdb_id,
        movieDbId: data.id.toString(),
        originalLanguage: data.original_language,
        originalTitle: data.original_title,
        overview: data.overview,
        popularity: data.popularity,
        posterPath: data.poster_path,
        releaseDate: new Date(data.release_date),
        revenue: data.revenue,
        status: data.status,
        tagline: data.tagline,
        title: data.title,
        type: data.type,
        voteAverage: data.vote_average,
        voteCount: data.vote_count
      },
      update: {
        adult: data.adult,
        backdropPath: data.backdrop_path,
        budget: data.budget,
        creators: {
          connectOrCreate: data.credits.crew.map((creator) => ({
            create: {
              imgUrl: creator.profile_path,
              name: creator.name,
              popularity: creator.popularity
            },
            where: { name: creator.name }
          }))
        },
        genres: {
          connectOrCreate: data.genres.map((genre) => ({
            create: { name: genre.name },
            where: { name: genre.name }
          }))
        },
        imdbId: data.imdb_id,
        movieDbId: data.id.toString(),
        originalLanguage: data.original_language,
        originalTitle: data.original_title,
        overview: data.overview,
        popularity: data.popularity,
        posterPath: data.poster_path,
        releaseDate: new Date(data.release_date),
        revenue: data.revenue,
        status: data.status,
        tagline: data.tagline,
        title: data.title,
        type: data.type,
        voteAverage: data.vote_average,
        voteCount: data.vote_count
      },
      where: {
        movieDbId: data.id.toString()
      }
    });

    // Delete all characters and recreate them
    await db.role.deleteMany({ where: { videoId: video.id } });

    await db.$transaction(async (prisma) => {
      const rolePromises = [];
      for (const actor of data.credits.cast) {
        const rolePromise = prisma.role.create({
          data: {
            actor: {
              connectOrCreate: {
                create: {
                  imgUrl: actor.profile_path,
                  name: actor.name,
                  popularity: actor.popularity
                },
                where: { name: actor.name }
              }
            },
            character: actor.character,
            order: actor.order,
            video: { connect: { id: video.id } }
          }
        });
        rolePromises.push(rolePromise);
      }
      await Promise.all(rolePromises);
    });

    return video;
  }

  async createOrUpdateRating(options: UpsertRatingOptions, db = this.prisma.db) {
    return db.rating.upsert({
      create: {
        note: options.rating,
        user: { connect: { id: options.userId } },
        video: { connect: { id: options.videoId } }
      },
      update: { note: options.rating },
      where: { userId_videoId: { userId: options.userId, videoId: options.videoId } }
    });
  }

  async deleteComment(commentId: string, db = this.prisma.db) {
    return db.comment.delete({ where: { id: commentId } });
  }

  async deleteRating(ratingId: string, db = this.prisma.db) {
    return db.rating.delete({ where: { id: ratingId } });
  }

  async getDetail({ videoClubId, videoId }: GetOneOptions, db = this.prisma.db) {
    return db.video.findFirst({
      include: {
        characters: { include: { actor: true } },
        comments: {
          include: { user: true },
          orderBy: { createdAt: 'asc' },
          where: { videoClubId }
        },
        ratings: {
          include: { user: true },
          orderBy: { createdAt: 'asc' },
          where: { user: { videoClubs: { some: { id: videoClubId } } } }
        }
      },
      orderBy: { releaseDate: 'desc' },
      where: {
        id: videoId,
        videoClubs: { some: { id: videoClubId } }
      }
    });
  }

  async getOne({ videoClubId, videoId }: GetBaseVideoOptions, db = this.prisma.db) {
    return db.video.findFirst({
      where: {
        id: videoId,
        videoClubs: { some: { id: videoClubId } }
      }
    });
  }

  async remove(options: RemoveVideoFromVideoClubOptions, db = this.prisma.db) {
    return db.video.update({
      data: { videoClubs: { disconnect: { id: options.videoClubId } } },
      where: { id: options.videoId }
    });
  }
}
