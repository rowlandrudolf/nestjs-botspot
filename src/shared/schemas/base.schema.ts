import { Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class BaseSchema {
  _id?: mongoose.Schema.Types.ObjectId;
}
