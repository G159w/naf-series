import { inject, injectable } from '@needle-di/core';
import Elysia, { t } from 'elysia';

import { AuthController } from '../common/factories/controllers.factory';
import { authGuard, toDto } from '../common/utils/elysia';
import { VideoClubDetailDtoSchema, VideoClubDtoSchema } from './dtos/videos-club.dto';
import { VideoClubsService } from './video-clubs.service';

@injectable()
export class VideoClubsController extends AuthController {
  constructor(private videoClubsService = inject(VideoClubsService)) {
    super();
  }

  routes() {
    return new Elysia({ tags: ['VideoClubs'] })
      .use(authGuard(this.sessionService))
      .group('/video-clubs', (app) =>
        app
          .get(
            '/',
            async ({ user }) => {
              return toDto(
                t.Array(VideoClubDtoSchema),
                this.videoClubsService.getAllForUser(user.id)
              );
            },
            {
              detail: {
                description: 'Get all video clubs for the user',
                summary: 'Get video clubs'
              },
              response: t.Array(VideoClubDtoSchema, {
                description: 'The video clubs related to the user'
              })
            }
          )
          .get(
            '/:videoClubId',
            async ({ params: { videoClubId }, query, user }) => {
              const club = this.videoClubsService.getDetail({
                search: { actors: query.actor, author: query.author, title: query.title },
                userId: user.id,
                videoClubId
              });
              return toDto(VideoClubDetailDtoSchema, club);
            },
            {
              detail: {
                description: 'Get the details of a video club with its videos',
                summary: 'Get video club'
              },
              params: t.Object({ videoClubId: t.String({ description: 'The video club id' }) }),
              query: t.Optional(
                t.Object({
                  actor: t.Optional(t.String()),
                  author: t.Optional(t.String()),
                  title: t.Optional(t.String())
                })
              ),
              response: VideoClubDetailDtoSchema
            }
          )
      );
  }

  protected prefix(): string {
    return '/video-clubs';
  }
}
