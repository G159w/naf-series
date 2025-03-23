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

type AllVideosClubs = Api['video-club']['index']['get'];
type CreateVideoClub = Api['video-club']['index']['post'];
type CreateVideoClubOptions = {
  name: string;
};
type DeleteVideoClub = ReturnType<Api['video-club']>['delete'];

type DeleteVideoClubOptions = {
  videoClubId: string;
};

type JoinVideoClub = ReturnType<ReturnType<Api['video-club']>['join']>['post'];
type JoinVideoClubOptions = {
  inviteId: string;
  videoClubId: string;
};

type VideoClubDetail = ReturnType<Api['video-club']>['get'];

type VideoClubDetailOptions = {
  videoClubId: string;
};

type VideoClubDetailSearchParams = {
  actor?: string;
  author?: string;
  title?: string;
};

/* -------------------------------------------------------------------------- */
/*                                     Api                                    */
/* -------------------------------------------------------------------------- */
export class VideoClubModule extends TanstackQueryModule<'videoClub'> {
  public namespace: 'videoClub' | null = 'videoClub';

  create() {
    return {
      mutationFn: async (options: CreateVideoClubOptions) =>
        await this.api['video-club']['index'].post({
          name: options.name
        }),
      mutationKey: [this.namespace, 'create']
    };
  }

  delete() {
    return {
      mutationFn: async (options: DeleteVideoClubOptions) =>
        await this.api['video-club']({ videoClubId: options.videoClubId }).delete(),
      mutationKey: [this.namespace, 'delete']
    };
  }

  findAll() {
    return {
      queryFn: () => this.api['video-club']['index'].get(),
      queryKey: [this.namespace, 'getAll']
    };
  }

  findOne({ videoClubId }: VideoClubDetailOptions) {
    return {
      queryFn: ({ actor, author, title }: VideoClubDetailSearchParams) =>
        this.api['video-club']({ videoClubId: videoClubId }).get({
          query: removeEmpty({ actor: actor, author: author, title: title })
        }),
      queryKey: [this.namespace, 'findOne', videoClubId]
    };
  }

  join(options: JoinVideoClubOptions) {
    return {
      mutationFn: async () =>
        await this.api['video-club']({ videoClubId: options.videoClubId })
          .join({ inviteId: options.inviteId })
          .post(),
      mutationKey: [this.namespace, 'join', options.inviteId, options.videoClubId]
    };
  }
}
