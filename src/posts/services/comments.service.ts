import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from '../schemas/comment.schema';
import { Post } from '../../posts/schemas/post.schema';
import { User } from '../../user/user.schema';
import { PersistCommentDto } from '../dto/persist-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
  ) {}

  async getComments(_id: string) {
    const post = await this.postModel.findById({ _id }); //.populate('comments');
    const comments = await this.commentModel
      .find({
        _id: { $in: post.comments },
      })
      .populate(['author'])
      .sort({ createdAt: -1 });
    return comments;
  }

  async addComment(user: User, postId: string, commentDto: PersistCommentDto) {
    const comment = new this.commentModel({
      ...commentDto,
      author: user,
    });
    await comment.save();

    await this.postModel.findByIdAndUpdate(
      postId,
      { $push: { comments: comment } },
      { new: true },
    );
    return comment;
  }

  async removeComment(user: User, postId: string, commentId: string) {
    const comment = await this.commentModel.findOneAndDelete({
      _id: commentId,
      author: user,
    });

    await this.postModel.findByIdAndUpdate(
      postId,
      { $pull: { comments: commentId } },
      { new: true },
    );
    return comment;
  }
}
