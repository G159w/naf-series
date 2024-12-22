import { inject, injectable } from '@needle-di/core';

import { NotFound } from '../common/utils/exceptions';
import { VideoClubsRepository } from './video-clubs.repository';

type GetOneDetailOptions = {
  search: {
    actors?: string;
    author?: string;
    genre?: string;
    title?: string;
  };
  userId: string;
  videoClubId: string;
};

type GetOneOptions = {
  userId: string;
  videoClubId: string;
};

@injectable()
export class VideoClubsService {
  constructor(private videoClubsRepository = inject(VideoClubsRepository)) {}

  async getAllForUser(userId: string) {
    return this.videoClubsRepository.getAllForUser(userId);
  }

  async getDetail(options: GetOneDetailOptions) {
    // Verify that user has access to the video club
    const club = await this.videoClubsRepository.getOneDetail(options);
    if (!club) {
      throw NotFound('Video club not found');
    }
    return club;
  }

  async getOne(options: GetOneOptions) {
    return this.videoClubsRepository.getOne(options);
  }
}