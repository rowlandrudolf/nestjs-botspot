import { User } from '@app/user/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Comment } from '@app/posts/schemas/comment.schema';
import * as denormalize from 'mongoose-denormalize';

@Schema({
  versionKey: false,
  timestamps: true,
  id: false,
  toJSON: { virtuals: true },
})
export class Post {
  @Prop()
  body: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: User;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  })
  readonly likedUsers: User[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }] })
  comments: Comment[];
}
export type PostDocument = HydratedDocument<Post>;

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.virtual('likesCount').get(function () {
  return this.likedUsers.length;
});

// PostSchema.plugin(denormalize, {
//   username: { from: 'author' },
// });
