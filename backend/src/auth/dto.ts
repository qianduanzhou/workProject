import { IsString, Length } from 'class-validator';

export class RegisterDto {
  @IsString()
  @Length(3, 24)
  username!: string;

  @IsString()
  @Length(6, 64)
  password!: string;
}

export class LoginDto {
  @IsString()
  username!: string;

  @IsString()
  password!: string;
}
