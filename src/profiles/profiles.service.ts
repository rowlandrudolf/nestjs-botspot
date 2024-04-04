import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/user.schema';
import { Follow } from './follow.schema';
import { ProfileSearchType, ProfileType } from './profiles.type';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Follow.name) private readonly followModel: Model<Follow>,
  ) {}

  async searchProfiles(usernameQuery: string): Promise<ProfileSearchType[]> {
    const profiles = await this.userModel
      .find({
        username: {
          $regex: `^${usernameQuery}`,
          $options: 'i',
        },
      })
      .limit(10);
    return profiles;
  }

  async getProfile(currentUser: User, username: string): Promise<ProfileType> {
    const profile = await this.userModel.findOne(
      {
        username: {
          $regex: `^${username}$`,
          $options: 'i',
        },
      },
      { _id: 1, username: 1 },
    );
    if (!profile) throw new NotFoundException('Profile not found');

    const isFollowing = await this.followModel.findOne({
      follower: currentUser,
      following: profile,
    });
    const followersCount = await this.followModel
      .find({ following: profile })
      .countDocuments();
    const followingCount = await this.followModel
      .find({ follower: profile })
      .countDocuments();

    return {
      ...profile.toObject(),
      followersCount,
      followingCount,
      following: !!isFollowing,
    };
  }

  async followUser(currentUser: User, username: string): Promise<ProfileType> {
    const profile = await this.userModel.findOne(
      {
        username: {
          $regex: `^${username}$`,
          $options: 'i',
        },
      },
      { _id: 1, username: 1 },
    );
    if (!profile) throw new NotFoundException('Profile not found');
    const relationship = {
      follower: currentUser,
      following: profile,
    };
    // avoid duplicate follows
    await this.followModel.findOneAndUpdate(relationship, relationship, {
      new: true,
      upsert: true,
    });
    const followersCount = await this.followModel
      .find({ following: profile })
      .countDocuments();
    const followingCount = await this.followModel
      .find({ follower: profile })
      .countDocuments();
    return {
      ...profile.toObject(),
      followersCount,
      followingCount,
      following: true,
    };
  }

  async unfollowUser(currentUser: User, username: string) {
    const profile = await this.userModel.findOne(
      {
        username: {
          $regex: `^${username}$`,
          $options: 'i',
        },
      },
      { _id: 1, username: 1 },
    );
    if (!profile) throw new NotFoundException('Profile not found');
    await this.followModel.findOneAndDelete({
      follower: currentUser,
      following: profile,
    });
    const followersCount = await this.followModel
      .find({ following: profile })
      .countDocuments();
    const followingCount = await this.followModel
      .find({ follower: profile })
      .countDocuments();
    return {
      ...profile.toObject(),
      followersCount,
      followingCount,
      following: false,
    };
  }
}
