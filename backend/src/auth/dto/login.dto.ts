import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email tidak valid' })
  @IsNotEmpty({ message: 'Email wajib diisi' })
  email!: string;

  @IsNotEmpty({ message: 'Password wajib diisi' })
  password!: string;
}
