import { inject, injectable } from '@needle-di/core';

import { NotFound } from '../common/utils/exceptions';
import { VideoClubsRepository } from './video-clubs.repository';

type CreateVideoClubOptions = {
  name: string;
  userId: string;
};

type DeleteVideoClubOptions = {
  userId: string;
  videoClubId: string;
};

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

type JoinByInviteOptions = {
  inviteId: string;
  userId: string;
  videoClubId: string;
};

@injectable()
export class VideoClubsService {
  constructor(private videoClubsRepository = inject(VideoClubsRepository)) {}

  async create(options: CreateVideoClubOptions) {
    return this.videoClubsRepository.create(options);
  }

  async delete(options: DeleteVideoClubOptions) {
    const videoClub = await this.videoClubsRepository.getOne(options);
    if (!videoClub) {
      throw NotFound('Video club not found');
    }
    return this.videoClubsRepository.delete(options);
  }

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

  async joinByInvite(options: JoinByInviteOptions) {
    // Verify the club exists and the invite is valid
    const videoClub = await this.videoClubsRepository.getByInviteId({
      inviteId: options.inviteId,
      videoClubId: options.videoClubId
    });

    if (!videoClub) {
      throw NotFound('Invalid invitation link');
    }

    // Check if the user is already a member
    const isMember = await this.videoClubsRepository.isMember({
      userId: options.userId,
      videoClubId: options.videoClubId
    });

    if (isMember) {
      return videoClub; // User is already a member, just return the club
    }

    // Add the user to the club
    return this.videoClubsRepository.addMember({
      userId: options.userId,
      videoClubId: options.videoClubId
    });
  }
}
