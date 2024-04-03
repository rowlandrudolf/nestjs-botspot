import { User } from '@app/user/user.schema';

export type ProfileType = Omit<User, 'email' | 'password'> & {
  following: boolean;
  followersCount: number;
  followingCount: number;
};
export type ProfileSearchType = Omit<User, 'email' | 'password'>;
