import { inject, injectable } from '@needle-di/core';

import { NotFound } from '../common/utils/exceptions';
import { MovieDbService } from './imdb.service';
import { VideoRepository } from './video.repository';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

type AddVideoToVideoClubOptions = {
  movieDbId: string;
  type: 'movie' | 'tv';
  userId: string;
  videoClubId: string;
};

type CreateCommentOptions = {
  content: string;
  userId: string;
  videoClubId: string;
  videoId: string;
};

type CreateRatingOptions = {
  rating: number;
  userId: string;
  videoClubId: string;
  videoId: string;
};

type GetOneOptions = {
  videoClubId: string;
  videoId: string;
};

type RemoveVideoFromVideoClubOptions = {
  userId: string;
  videoClubId: string;
  videoId: string;
};

/* -------------------------------------------------------------------------- */
/*                                 Service                                    */
/* -------------------------------------------------------------------------- */

@injectable()
export class VideoService {
  constructor(
    private videosRepository = inject(VideoRepository),
    private movieDbService = inject(MovieDbService)
  ) {}

  async addVideoToVideoClub(options: AddVideoToVideoClubOptions) {
    // Check if user is in the video club

    // Service Imbd to fetch the video details
    const videoDetails = await this.movieDbService.getMovieDbDetails(
      options.movieDbId,
      options.type
    );

    // Service to fetch the video
    const video = await this.videosRepository.createOrUpdate(videoDetails);
    return this.videosRepository.addVideoToVideoClub({
      videoClubId: options.videoClubId,
      videoId: video.id
    });
  }

  async all(videoClubId: string) {
    return this.videosRepository.all(videoClubId);
  }

  async createComment(options: CreateCommentOptions) {
    return this.videosRepository.createComment(options);
  }

  async createOrCreateRating(options: CreateRatingOptions) {
    return this.videosRepository.createOrUpdateRating(options);
  }

  async deleteComment(commentId: string, userId: string) {
    console.log(userId);
    // Check if the user is the owner of the comment
    return this.videosRepository.deleteComment(commentId);
  }

  async deleteRating(ratingId: string, userId: string) {
    console.log(userId);
    // Check if the user is the owner of the rating
    return this.videosRepository.deleteRating(ratingId);
  }

  async getDetail(options: GetOneOptions) {
    const video = await this.videosRepository.getDetail(options);
    if (!video) throw NotFound('Video not found');
    return video;
  }

  async refreshVideo(options: GetOneOptions) {
    const video = await this.videosRepository.getOne(options);

    if (!video) {
      throw NotFound('Video not found');
    }

    // Service Imbd to fetch the video details
    const videoDetails = await this.movieDbService.getMovieDbDetails(
      video.movieDbId,
      video.type === 'Movie' ? 'movie' : 'tv'
    );

    // Service to fetch the video
    return this.videosRepository.createOrUpdate(videoDetails);
  }

  async remove(options: RemoveVideoFromVideoClubOptions) {
    // Check if user is in the video club
    return this.videosRepository.remove(options);
  }

  async search(query: string) {
    return this.movieDbService.searchMovieDb(query);
  }
}
