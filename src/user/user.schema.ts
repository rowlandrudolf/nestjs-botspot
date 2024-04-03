import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { hash } from 'bcrypt';
import { BaseSchema } from '@app/shared/schemas/base.schema';

export type UserDocument = HydratedDocument<User>;
export type UserResponseType = Omit<User, 'password'> & { token: string };

@Schema({
  versionKey: false,
})
export class User extends BaseSchema {
  @Prop({ unique: true })
  email: string;

  @Prop({ unique: true })
  username: string;

  @Prop({ select: false })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// UserSchema.path('email').validate(async function (email) {
//   console.log(mongoose.models);
//   const emailExists = await mongoose.models.User.countDocuments({
//     email: new RegExp(`^${email}`, 'i'),
//   });
//   return !emailExists;
// }, 'Email exists');

// UserSchema.path('username').validate(async function (username) {
//   const emailExists = await mongoose.models.User.countDocuments({
//     username: new RegExp(`^${username}`, 'i'),
//   });
//   return !emailExists;
// }, 'Username taken');

UserSchema.pre<User>('save', async function (next) {
  this.password = await hash(this.password, 10);
  next();
});
