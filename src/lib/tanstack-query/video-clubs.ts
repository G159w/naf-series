import type { Api, ApiQuery, UnwrapApiReturnType } from '$lib/utils/types';

import { removeEmpty } from '$lib/utils/api';

import { TanstackQueryModule } from './query-module';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export type AllVideoClubsResponse = UnwrapApiReturnType<AllVideosClubs>;
export type VideoClubDetailResponse = UnwrapApiReturnType<VideoClubDetail>;

type AllVideosClubs = Api['video-clubs']['index']['get'];
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

  findAll(): ApiQuery<AllVideosClubs> {
    return {
      queryFn: async () => await this.api['video-clubs']['index'].get(),
      queryKey: [this.namespace, 'getAll']
    };
  }

  findOne(options: VideoClubDetailOptions): ApiQuery<VideoClubDetail> {
    return {
      queryFn: async () =>
        await this.api['video-clubs']({ videoClubId: options.videoClubId }).get({
          query: removeEmpty({ actor: options.actor, author: options.author, title: options.title })
        }),
      queryKey: [this.namespace, 'videoClub', options]
    };
  }
}
