import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsService } from '../posts/services/posts.service';
import { PostsController } from '../posts/posts.controller';
import { Post, PostSchema } from '../posts/schemas/post.schema';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { CommentsService } from './services/comments.service';
import { Follow, FollowSchema } from '../profiles/follow.schema';
import { User, UserSchema } from '../user/user.schema';

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
