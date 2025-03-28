import { inject, injectable } from '@needle-di/core';
import Elysia, { t } from 'elysia';

import { AuthController } from '../common/factories/controllers.factory';
import { authGuard, toDto } from '../common/utils/elysia';
import { VideoClubDetailDtoSchema, VideoClubDtoSchema } from './dto/video-club.dto';
import { VideoClubService } from './video-club.service';

@injectable()
export class VideoClubController extends AuthController {
  constructor(private videoClubsService = inject(VideoClubService)) {
    super();
  }

  routes() {
    return new Elysia({ tags: ['VideoClubs'] })
      .use(authGuard(this.sessionService))
      .group('/video-club', (app) =>
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
          .post(
            '/',
            async ({ body, user }) => {
              const videoClub = await this.videoClubsService.create({
                name: body.name,
                userId: user.id
              });
              return toDto(VideoClubDtoSchema, videoClub);
            },
            {
              body: t.Object({
                name: t.String({ description: 'The name of the video club' })
              }),
              detail: {
                description: 'Create a new video club',
                summary: 'Create video club'
              },
              response: VideoClubDtoSchema
            }
          )
          .post(
            '/:videoClubId/join/:inviteId',
            async ({ params: { inviteId, videoClubId }, user }) => {
              const videoClub = await this.videoClubsService.joinByInvite({
                inviteId,
                userId: user.id,
                videoClubId
              });
              return toDto(VideoClubDtoSchema, videoClub);
            },
            {
              detail: {
                description: 'Join a video club using an invitation link',
                summary: 'Join video club'
              },
              params: t.Object({
                inviteId: t.String({ description: 'The video club invitation id' }),
                videoClubId: t.String({ description: 'The video club id' })
              }),
              response: VideoClubDtoSchema
            }
          )
          .delete(
            '/:videoClubId',
            async ({ params: { videoClubId }, user }) => {
              await this.videoClubsService.delete({
                userId: user.id,
                videoClubId
              });
              return { success: true };
            },
            {
              detail: {
                description: 'Delete a video club',
                summary: 'Delete video club'
              },
              params: t.Object({ videoClubId: t.String({ description: 'The video club id' }) }),
              response: t.Object({ success: t.Boolean() })
            }
          )
      );
  }

  protected prefix(): string {
    return '/video-clubs';
  }
}
