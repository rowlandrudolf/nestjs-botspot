import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../schemas/post.schema';
import { User, UserDocument } from '../../user/user.schema';
import { PersistPostDto } from '../dto/persist-post.dto';
import { Follow, FollowDocument } from '../../profiles/follow.schema';
import { Comment, CommentDocument } from '../schemas/comment.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    @InjectModel(Follow.name)
    private readonly followModel: Model<FollowDocument>,
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(user: User, postDto: PersistPostDto) {
    return await this.postModel.create({
      ...postDto,
      author: user,
    });
  }

  async getAll(filter = null, pagination = null) {
    const count = await this.postModel.find(filter).countDocuments();
    const posts = await this.postModel
      .find(filter, null, pagination)
      .populate(['author'])
      .sort({ createdAt: -1 });

    return {
      posts,
      count,
    };
  }

  async getFeed(currentUser: User, pagination = null) {
    const follows = await this.followModel.find({ follower: currentUser });
    const followsIds = follows.map((f) => f.following);
    const filter = { author: { $in: followsIds } };
    const count = await this.postModel.find(filter).countDocuments();
    const posts = await this.postModel
      .find(filter, null, pagination)
      .populate(['author'])
      .sort({ createdAt: -1 });

    return {
      posts,
      count,
    };
  }

  async findOne(_id: string) {
    const post = await this.postModel
      .findById(_id)
      .populate(['author', 'comments']);
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async userFeed(username: string, pagination = null) {
    const profile = await this.userModel.findOne(
      {
        username: {
          $regex: `^${username}$`,
          $options: 'i',
        },
      },
      { _id: 1, username: 1 },
    );
    const count = await this.postModel
      .find({ author: profile })
      .countDocuments();
    const posts = await this.postModel
      .find({ author: profile }, null, pagination)
      .populate(['author'])
      .sort({ createdAt: -1 });
    return {
      posts,
      count,
    };
  }
  // create(createPostDto: CreatePostDto) {
  //   return 'This action adds a new post';
  // }

  // findAll() {
  //   return `This action returns all posts`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} post`;
  // }

  // update(id: number, updatePostDto: UpdatePostDto) {
  //   return `This action updates a #${id} post`;
  // }

  async remove(user: User, _id: string) {
    const post = await this.postModel.findOne({
      _id,
      author: user,
    });
    // const post = await this.postModel.findOneAndDelete({
    //   _id,
    //   author: user,
    // });
    await this.commentModel.deleteMany({ _id: { $in: post.comments } });
    await this.postModel.deleteOne({ _id: post._id });
    return post;
  }

  async like(user: User, _id: string) {
    return await this.postModel
      .findOneAndUpdate(
        { _id },
        {
          $addToSet: { likedUsers: user._id },
        },
        { new: true },
      )
      .populate(['author']);
  }

  async unlike(user: User, _id: string) {
    return await this.postModel
      .findOneAndUpdate(
        { _id },
        {
          $pull: { likedUsers: user._id },
        },
        { new: true },
      )
      .populate(['author']);
  }

  addLikedToPost(post: PostDocument, user: User) {
    return {
      ...post.toJSON(),
      liked:
        user !== null
          ? !!post.likedUsers.find(
              (u) => u._id.toString() === user._id.toString(),
            )
          : false,
    };
  }
}
