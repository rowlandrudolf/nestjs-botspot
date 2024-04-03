import { IsNotEmpty } from 'class-validator';

export class PersistPostDto {
  @IsNotEmpty()
  body: string;
}
