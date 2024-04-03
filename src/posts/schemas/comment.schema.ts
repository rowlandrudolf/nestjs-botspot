import { BaseSchema } from '@app/shared/schemas/base.schema';
import { User } from '@app/user/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema({
  versionKey: false,
  timestamps: true,
})
export class Comment extends BaseSchema {
  @Prop()
  note: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: User;
}

export type CommentDocument = HydratedDocument<Comment>;

export const CommentSchema = SchemaFactory.createForClass(Comment);
