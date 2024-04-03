import { Module } from '@nestjs/common';
import { PostsService } from '@app/posts/services/posts.service';
import { PostsController } from '@app/posts/posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from '@app/posts/schemas/post.schema';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { CommentsService } from './services/comments.service';
import { Follow, FollowSchema } from '@app/profiles/follow.schema';
import { User, UserSchema } from '@app/user/user.schema';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: User.name, schema: UserSchema },
      { name: Follow.name, schema: FollowSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
  ],
  controllers: [PostsController],
  providers: [PostsService, CommentsService],
})
export class PostsModule {}
