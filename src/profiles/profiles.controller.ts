import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { User } from '../user/user.schema';
import { ProfilesService } from './profiles.service';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('/search')
  async searchProfile(@Query('username') usernameQuery: string) {
    const profiles = await this.profilesService.searchProfiles(usernameQuery);
    return { profiles };
  }

  @Get(':username')
  async getProfile(
    @CurrentUser() currentUser: User,
    @Param('username') username: string,
  ) {
    const profile = await this.profilesService.getProfile(
      currentUser,
      username,
    );
    return { profile };
  }

  @Post(':username/follow')
  @UseGuards(AuthGuard)
  async followUser(
    @CurrentUser() currentUser: User,
    @Param('username') username: string,
  ) {
    const profile = await this.profilesService.followUser(
      currentUser,
      username,
    );
    return { profile };
  }

  @Delete(':username/follow')
  @UseGuards(AuthGuard)
  async unfollowUser(
    @CurrentUser() currentUser: User,
    @Param('username') username: string,
  ) {
    const removed = await this.profilesService.unfollowUser(
      currentUser,
      username,
    );
    return { removed };
  }
  
}
