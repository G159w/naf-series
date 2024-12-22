import { inject, injectable } from '@needle-di/core';
import Elysia, { t } from 'elysia';

import { AuthController } from '../common/factories/controllers.factory';
import { authGuard, toDto } from '../common/utils/elysia';
import { DBMovieApiResultSearchSchema } from './dtos/dbmovie.dto';
import { VideoDtoSchema } from './dtos/videos.dto';
import { VideosService } from './videos.service';

enum Tags {
  Comments = 'Comments',
  Ratings = 'Ratings',
  Videos = 'Videos'
}

@injectable()
export class VideosController extends AuthController {
  constructor(private videosService = inject(VideosService)) {
    super();
  }

  routes() {
    return new Elysia({ tags: ['VideoClubs'] })
      .use(authGuard(this.sessionService))
      .group('/video-clubs/:videoClubId/videos', (app) =>
        app
          .post(
            '/',
            async ({ body, params: { videoClubId }, user }) => {
              const video = await this.videosService.addVideoToVideoClub({
                movieDbId: body.movieDbId,
                type: body.type,
                userId: user.id,
                videoClubId
              });
              return toDto(t.Object({ id: t.String() }), video);
            },
            {
              body: t.Object({
                movieDbId: t.String({ description: 'The movie database id' }),
                type: t.Union([t.Literal('movie'), t.Literal('tv')], {
                  description: 'The type of the video',
                  examples: ['movie', 'tv']
                })
              }),
              detail: {
                description:
                  'Add a video to the video club, it will fetch the details from the Movie Database API',
                summary: 'Add video'
              },
              params: t.Object({ videoClubId: t.String({ description: 'The video club id' }) }),
              response: t.Object({ id: t.String() }, { description: 'The video id' }),
              tags: [Tags.Videos]
            }
          )
          .get(
            '/search',
            async ({ query }) => {
              const result = await this.videosService.search(query.query);
              return toDto(DBMovieApiResultSearchSchema, result);
            },
            {
              detail: {
                description:
                  'Do a query search using the Movie Database API. It will look for movies and tv shows',
                summary: 'Search in Movie Database'
              },
              params: t.Object({
                videoClubId: t.String({ description: 'The video club id' })
              }),
              query: t.Object({
                query: t.String({ description: 'The query used to search', examples: ['Loki'] })
              }),
              response: DBMovieApiResultSearchSchema,
              tags: [Tags.Videos]
            }
          )
          .get(
            '/:videoId',
            async ({ params: { videoClubId, videoId } }) => {
              const video = await this.videosService.getDetail({ videoClubId, videoId });
              return toDto(VideoDtoSchema, video);
            },
            {
              detail: {
                description: 'Get the detailed video with all the actor, character, comment etc...',
                summary: 'Video details'
              },
              params: t.Object({
                videoClubId: t.String({ description: 'The video club id' }),
                videoId: t.String({ description: 'The video id' })
              }),
              response: VideoDtoSchema,
              tags: [Tags.Videos]
            }
          )
          .delete(
            '/:videoId',
            async ({ params: { videoClubId, videoId }, user }) => {
              const video = await this.videosService.remove({
                userId: user.id,
                videoClubId,
                videoId
              });
              return toDto(t.Object({ id: t.String() }), video);
            },
            {
              detail: {
                description: 'Remove a video from the video club',
                summary: 'Remove video'
              },
              params: t.Object({
                videoClubId: t.String({ description: 'The video club id' }),
                videoId: t.String({ description: 'The video id' })
              }),
              response: t.Object({ id: t.String() }, { description: 'The video id' }),
              tags: [Tags.Videos]
            }
          )
          .put(
            '/:videoId/refresh',
            async ({ params: { videoClubId, videoId } }) => {
              const video = await this.videosService.refreshVideo({ videoClubId, videoId });
              return toDto(t.Object({ id: t.String() }), video);
            },
            {
              detail: {
                description: 'Refresh the video details from the Movie Database API',
                summary: 'Refresh video'
              },
              params: t.Object({
                videoClubId: t.String({ description: 'The video club id' }),
                videoId: t.String({ description: 'The video id' })
              }),
              response: t.Object({ id: t.String() }, { description: 'The video id' }),
              tags: [Tags.Videos]
            }
          )
          .delete(
            '/:videoId/comments/:commentId',
            async ({ params: { commentId }, user }) => {
              await this.videosService.deleteComment(commentId, user.id);
            },
            {
              detail: { description: 'Delete a comment on a video', summary: 'Delete comment' },
              params: t.Object({
                commentId: t.String({ description: 'The comment id to be deleted' }),
                videoClubId: t.String({ description: 'The video club id' }),
                videoId: t.String({ description: 'The video id to delete comment on' })
              }),
              tags: [Tags.Comments]
            }
          )
          .post(
            '/:videoId/comments',
            async ({ body, params: { videoClubId, videoId }, user }) => {
              const comment = await this.videosService.createComment({
                content: body.content,
                userId: user.id,
                videoClubId,
                videoId
              });
              return toDto(t.Object({ id: t.String() }), comment);
            },
            {
              body: t.Object({
                content: t.String({
                  description: 'The content of the comment',
                  examples: ['This movies was super !']
                })
              }),
              detail: {
                description: 'Create a comment on a video',
                summary: 'Create comment'
              },
              params: t.Object({
                videoClubId: t.String({ description: 'The video club id' }),
                videoId: t.String({ description: 'The video id to comment on' })
              }),
              response: t.Object({ id: t.String() }, { description: 'The comment id' }),
              tags: [Tags.Comments]
            }
          )
          .post(
            '/:videoId/ratings',
            async ({ body, params: { videoClubId, videoId }, user }) => {
              return this.videosService.createOrCreateRating({
                rating: body.rating,
                userId: user.id,
                videoClubId,
                videoId
              });
            },
            {
              body: t.Object({
                rating: t.Number({
                  description: 'The rating given to the video',
                  maximum: 10,
                  minimum: 0
                })
              }),
              detail: {
                description: 'Create a rating on a video',
                summary: 'Create rating'
              },
              params: t.Object({
                videoClubId: t.String({ description: 'The video club id' }),
                videoId: t.String({ description: 'The video id to rate on' })
              }),
              response: t.Object({ id: t.String() }, { description: 'The rating id' }),
              tags: [Tags.Ratings]
            }
          )
          .put(
            '/:videoId/ratings/:ratingId',
            async ({ body, params: { videoClubId, videoId }, user }) => {
              return this.videosService.createOrCreateRating({
                rating: body.rating,
                userId: user.id,
                videoClubId,
                videoId
              });
            },
            {
              body: t.Object({
                rating: t.Number({
                  description: 'The rating given to the video',
                  maximum: 10,
                  minimum: 0
                })
              }),
              detail: {
                description: 'Update a rating on a video',
                summary: 'Update rating'
              },
              params: t.Object({
                ratingId: t.String({ description: 'The rating id to be updated' }),
                videoClubId: t.String({ description: 'The video club id' }),
                videoId: t.String({ description: 'The video id to rate on' })
              }),
              response: t.Object({ id: t.String() }, { description: 'The rating id' }),
              tags: [Tags.Ratings]
            }
          )
          .delete(
            '/:videoId/ratings/:ratingId',
            async ({ params: { ratingId }, user }) => {
              return this.videosService.deleteRating(ratingId, user.id);
            },
            {
              detail: { description: 'Delete a rating on a video', summary: 'Delete rating' },
              params: t.Object({
                ratingId: t.String({ description: 'The rating id to be deleted' }),
                videoClubId: t.String({ description: 'The video club id' }),
                videoId: t.String({ description: 'The video id to delete on' })
              }),
              tags: [Tags.Ratings]
            }
          )
      );
  }
}
