import { IsNotEmpty } from 'class-validator';

export class PersistCommentDto {
  @IsNotEmpty()
  note: string;
}
