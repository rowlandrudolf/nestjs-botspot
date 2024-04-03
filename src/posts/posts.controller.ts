import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PostsService } from '@app/posts/services/posts.service';
import { CurrentUser } from '@app/auth/decorators/current-user.decorator';
import { User, UserDocument } from '@app/user/user.schema';
import { PersistPostDto } from '@app/posts/dto/persist-post.dto';
import { AuthGuard } from '@app/auth/guards/auth.guard';
import { whitelistParams } from '@app/posts/utils/whitelist-params';
import { isObjectIdOrHexString } from 'mongoose';
import { PersistCommentDto } from './dto/persist-comment.dto';
import { CommentsService } from '@app/posts/services/comments.service';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly commentService: CommentsService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @CurrentUser() currentUser: UserDocument,
    @Body('post') persistPostDto: PersistPostDto,
  ) {
    const post = await this.postsService.create(currentUser, persistPostDto);
    return { post: this.postsService.addLikedToPost(post, currentUser) };
  }

  @Get()
  async getAll(
    @CurrentUser() currentUser: UserDocument,
    @Query() queryParams: object,
  ) {
    const pagination = whitelistParams(queryParams, ['skip', 'limit']);
    //const filter = whitelistParams(queryParams, ['author.username']);
    const { posts, count } = await this.postsService.getAll(null, pagination);
    return {
      posts: posts.map((post) =>
        this.postsService.addLikedToPost(post, currentUser),
      ),
      count,
    };
  }

  @Get('feed')
  async getFeed(
    @CurrentUser() currentUser: UserDocument,
    @Query() queryParams: object,
  ) {
    const pagination = whitelistParams(queryParams, ['skip', 'limit']);
    const { posts, count } = await this.postsService.getFeed(
      currentUser,
      pagination,
    );
    return {
      posts: posts.map((post) =>
        this.postsService.addLikedToPost(post, currentUser),
      ),
      count,
    };
  }

  @Get('/:username')
  async userFeed(
    @CurrentUser() currentUser: UserDocument,
    @Param('username') username: string,
    @Query() queryParams: object,
  ) {
    const pagination = whitelistParams(queryParams, ['skip', 'limit']);

    const { posts, count } = await this.postsService.userFeed(
      username,
      pagination,
    );
    return {
      posts: posts.map((post) =>
        this.postsService.addLikedToPost(post, currentUser),
      ),
      count,
    };
  }

  @Get(':id')
  async findOne(@Param('id') _id: string) {
    if (!isObjectIdOrHexString(_id))
      throw new UnprocessableEntityException('Invalid ID');
    const post = await this.postsService.findOne(_id);
    return { post };
  }
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
  //   return this.postsService.update(+id, updatePostDto);
  // }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@CurrentUser() currentUser: User, @Param('id') _id: string) {
    const removed = await this.postsService.remove(currentUser, _id);
    return { removed };
  }

  // likes
  @Post(':id/like')
  @UseGuards(AuthGuard)
  async like(@CurrentUser() currentUser: User, @Param('id') _id: string) {
    const post = await this.postsService.like(currentUser, _id);
    return { post: this.postsService.addLikedToPost(post, currentUser) };
  }

  @Delete(':id/like')
  @UseGuards(AuthGuard)
  async unlike(@CurrentUser() currentUser: User, @Param('id') _id: string) {
    const post = await this.postsService.unlike(currentUser, _id);
    return { post: this.postsService.addLikedToPost(post, currentUser) };
  }

  // Comments
  @Get(':id/comments')
  async getComments(@Param('id') postId: string) {
    if (!isObjectIdOrHexString(postId))
      throw new UnprocessableEntityException('Invalid ID');
    const comments = await this.commentService.getComments(postId);
    return { comments };
  }

  @Post(':id/comments')
  @UseGuards(AuthGuard)
  async addComment(
    @CurrentUser() currentUser: User,
    @Param('id') postId: string,
    @Body('comment') commentDto: PersistCommentDto,
  ) {
    if (!isObjectIdOrHexString(postId))
      throw new UnprocessableEntityException('Invalid ID');
    const comment = await this.commentService.addComment(
      currentUser,
      postId,
      commentDto,
    );
    return { comment };
  }

  @Delete(':id/comments/:comment_id')
  @UseGuards(AuthGuard)
  async removeComment(
    @CurrentUser() currentUser: User,
    @Param('id') _id: string,
    @Param('comment_id') commentId: string,
  ) {
    if (!isObjectIdOrHexString(_id))
      throw new UnprocessableEntityException('Invalid ID');
    const removed = await this.commentService.removeComment(
      currentUser,
      _id,
      commentId,
    );
    return { removed };
  }
}
