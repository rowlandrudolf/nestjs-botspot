import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Follow, FollowSchema } from '@app/profiles/follow.schema';
import { ProfilesController } from '@app/profiles/profiles.controller';
import { ProfilesService } from '@app/profiles/profiles.service';
import { User, UserSchema } from '@app/user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Follow.name, schema: FollowSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ProfilesController],
  providers: [ProfilesService],
})
export class ProfilesModule {}
