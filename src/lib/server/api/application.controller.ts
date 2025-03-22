import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { inject, injectable } from '@needle-di/core';
import Elysia from 'elysia';

import { Conflict, httpError } from './common/utils/exceptions';
import { VideoClubController } from './video-club/video-club.controller';
import { VideoController } from './video/video.controller';

@injectable()
export class ApplicationController {
  constructor(
    private videoClubsController = inject(VideoClubController),
    private videosController = inject(VideoController)
  ) {}

  async registerControllers() {
    return new Elysia()
      .use(
        await swagger({
          documentation: {
            info: {
              title: 'Naf Series API Documentation',
              version: '1.0.0'
            }
          },
          path: '/api/swagger'
        })
      )
      .use(cors({ origin: true }))
      .use(
        new Elysia({ prefix: '/api' })
          .use(httpError())
          .trace(async ({ context, onHandle }) => {
            onHandle(({ begin, onStop }) => {
              onStop(({ end }) => {
                console.log(`${context.request.method} ${context.path} took ${end - begin} ms`);
              });
            });
          })
          .use(this.routes())
          .use(this.videoClubsController.routes())
          .use(this.videosController.routes())
      );
  }

  routes() {
    return new Elysia({ tags: ['Debug'] })
      .get('/', () => ({ status: 'ok' }), { detail: { summary: 'Health check' } })
      .get(
        '/error',
        () => {
          throw Conflict('Formatted Error Test');
        },
        { detail: { description: 'Should return a formatted 409 error', summary: 'Error Test' } }
      );
  }
}
