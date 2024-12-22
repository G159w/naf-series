import type { Api, ApiQuery, UnwrapApiReturnType } from '$lib/utils/types';

import { TanstackQueryModule } from './query-module';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export type CreateRatingResponse = UnwrapApiReturnType<CreateRating>;
export type DeleteCommentResponse = UnwrapApiReturnType<DeleteComment>;
export type DeleteRatingResponse = UnwrapApiReturnType<DeleteRating>;
export type GetVideoDetailResponse = UnwrapApiReturnType<GetVideoDetail>;
export type PostCommentResponse = UnwrapApiReturnType<PostComment>;
export type UpdateRatingResponse = UnwrapApiReturnType<UpdateRating>;

type AddVideoOptions = {
  movieDbId: string;
  type: 'movie' | 'tv';
  videoClubId: string;
};
type CreateRating = VideoEndPoint['ratings']['post'];
type CreateRatingOptions = {
  rating: number;
  videoClubId: string;
  videoId: string;
};

type DeleteComment = ReturnType<VideoEndPoint['comments']>['delete'];
type DeleteCommentOptions = {
  commentId: string;
  videoClubId: string;
  videoId: string;
};
type DeleteRating = ReturnType<VideoEndPoint['ratings']>['delete'];

type DeleteRatingOptions = {
  ratingId: string;
  videoClubId: string;
  videoId: string;
};
type GetVideoDetail = VideoEndPoint['get'];

type GetVideoDetailOptions = {
  videoClubId: string;
  videoId: string;
};
type PostComment = VideoEndPoint['comments']['post'];

type PostCommentOptions = {
  content: string;
  videoClubId: string;
  videoId: string;
};
type SearchVideoOptions = {
  query: string;
  videoClubId: string;
};

type UpdateRating = ReturnType<VideoEndPoint['ratings']>['put'];

type UpdateRatingOptions = {
  rating: number;
  ratingId: string;
  videoClubId: string;
  videoId: string;
};

type VideoEndPoint = ReturnType<ReturnType<Api['video-clubs']>['videos']>;

/* -------------------------------------------------------------------------- */
/*                                     Api                                    */
/* -------------------------------------------------------------------------- */
export class VideosModule extends TanstackQueryModule<'videos'> {
  public namespace: 'videos' | null = 'videos';

  addVideo() {
    return {
      mutationFn: async (options: AddVideoOptions) =>
        await this.api['video-clubs']({ videoClubId: options.videoClubId }).videos['index'].post({
          movieDbId: options.movieDbId,
          type: options.type
        })
    };
  }

  createRating() {
    return {
      mutationFn: async (options: CreateRatingOptions) =>
        await this.api['video-clubs']({ videoClubId: options.videoClubId })
          .videos({ videoId: options.videoId })
          ['ratings']['post']({ rating: options.rating })
    };
  }

  deleteComment() {
    return {
      mutationFn: async (options: DeleteCommentOptions) =>
        await this.api['video-clubs']({ videoClubId: options.videoClubId })
          .videos({ videoId: options.videoId })
          ['comments']({ commentId: options.commentId })
          .delete()
    };
  }

  deleteRating() {
    return {
      mutationFn: async (options: DeleteRatingOptions) =>
        await this.api['video-clubs']({ videoClubId: options.videoClubId })
          .videos({ videoId: options.videoId })
          ['ratings']({ ratingId: options.ratingId })
          ['delete']()
    };
  }

  getDetail(options: GetVideoDetailOptions): ApiQuery<GetVideoDetail> {
    return {
      queryFn: async () =>
        await this.api['video-clubs']({ videoClubId: options.videoClubId })
          .videos({ videoId: options.videoId })
          .get(),
      queryKey: [this.namespace, 'detail', options]
    };
  }
  postComment() {
    return {
      mutationFn: async (options: PostCommentOptions) =>
        await this.api['video-clubs']({ videoClubId: options.videoClubId })
          .videos({ videoId: options.videoId })
          ['comments']['post']({ content: options.content })
    };
  }
  searchVideos(options: SearchVideoOptions) {
    return {
      queryFn: async () =>
        await this.api['video-clubs']({ videoClubId: options.videoClubId }).videos.search.get({
          query: { query: options.query }
        }),
      queryKey: [this.namespace, 'search', options]
    };
  }
  updateRating() {
    return {
      mutationFn: async (options: UpdateRatingOptions) =>
        await this.api['video-clubs']({ videoClubId: options.videoClubId })
          .videos({ videoId: options.videoId })
          ['ratings']({ ratingId: options.ratingId })
          ['put']({ rating: options.rating })
    };
  }
}
