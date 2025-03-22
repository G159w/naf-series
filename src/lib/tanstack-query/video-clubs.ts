import type { Api, ApiQuery, UnwrapApiReturnType } from '$lib/utils/types';

import { removeEmpty } from '$lib/utils/api';

import { TanstackQueryModule } from './query-module';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export type AllVideoClubsResponse = UnwrapApiReturnType<AllVideosClubs>;
export type CreateVideoClubResponse = UnwrapApiReturnType<CreateVideoClub>;
export type DeleteVideoClubResponse = UnwrapApiReturnType<DeleteVideoClub>;
export type JoinVideoClubResponse = UnwrapApiReturnType<JoinVideoClub>;
export type VideoClubDetailResponse = UnwrapApiReturnType<VideoClubDetail>;

type AllVideosClubs = Api['video-clubs']['index']['get'];
type CreateVideoClub = Api['video-clubs']['index']['post'];
type CreateVideoClubOptions = {
  name: string;
};
type DeleteVideoClub = ReturnType<Api['video-clubs']>['delete'];

type DeleteVideoClubOptions = {
  videoClubId: string;
};

type JoinVideoClub = ReturnType<ReturnType<Api['video-clubs']>['join']>['post'];
type JoinVideoClubOptions = {
  inviteId: string;
  videoClubId: string;
};

type VideoClubDetail = ReturnType<Api['video-clubs']>['get'];

type VideoClubDetailOptions = {
  actor?: string;
  author?: string;
  title?: string;
  videoClubId: string;
};

/* -------------------------------------------------------------------------- */
/*                                     Api                                    */
/* -------------------------------------------------------------------------- */
export class VideoClubsModule extends TanstackQueryModule<'videoClubs'> {
  public namespace: 'videoClubs' | null = 'videoClubs';

  create() {
    return {
      mutationFn: async (options: CreateVideoClubOptions) =>
        await this.api['video-clubs']['index'].post({
          name: options.name
        }),
      mutationKey: [this.namespace, 'create']
    };
  }

  delete() {
    return {
      mutationFn: async (options: DeleteVideoClubOptions) =>
        await this.api['video-clubs']({ videoClubId: options.videoClubId }).delete(),
      mutationKey: [this.namespace, 'delete']
    };
  }

  findAll() {
    return {
      queryFn: () => this.api['video-clubs']['index'].get(),
      queryKey: [this.namespace, 'getAll']
    };
  }

  findOne(options: VideoClubDetailOptions): ApiQuery<VideoClubDetail> {
    return {
      queryFn: () =>
        this.api['video-clubs']({ videoClubId: options.videoClubId }).get({
          query: removeEmpty({ actor: options.actor, author: options.author, title: options.title })
        }),
      queryKey: [this.namespace, 'videoClub', options]
    };
  }

  join(options: JoinVideoClubOptions) {
    return {
      mutationFn: async () =>
        await this.api['video-clubs']({ videoClubId: options.videoClubId })
          .join({ inviteId: options.inviteId })
          .post(),
      mutationKey: [this.namespace, 'join', options.inviteId, options.videoClubId]
    };
  }
}
