import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { RegisterDto } from '../shared/dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(registerDto: RegisterDto): Promise<UserDocument> {
    const userExists = await this.userModel.findOne({
      $or: [
        {
          email: {
            $regex: `^${registerDto.email}`,
            $options: 'i',
          },
        },
        {
          username: {
            $regex: `^${registerDto.username}`,
            $options: 'i',
          },
        },
      ],
    });
    if (userExists) {
      throw new UnprocessableEntityException('Email or Username unavaliable');
    }
    const user = new this.userModel(registerDto);
    return user.save();
  }

  async updateUser(currentUser: UserDocument, updateUserDo: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(currentUser._id, updateUserDo, {
      new: true,
    });
  }
  async findByEmail(email: string, projection = {}) {
    return this.userModel.findOne(
      {
        email: {
          $regex: `^${email}$`,
          $options: 'i',
        },
      },
      projection,
    );
  }

  async findByUsername(username: string) {
    if (!username)
      throw new UnprocessableEntityException('No username provided.');
    return this.userModel.findOne({
      username: {
        $regex: `^${username}$`,
        $options: 'i',
      },
    });
  }

  async findById(_id: string, projection = {}) {
    return this.userModel.findById(_id, projection);
  }
}
