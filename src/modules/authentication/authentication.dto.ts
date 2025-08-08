import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNumber, IsString, MinLength } from "class-validator"

export class RegisterDto {
  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string
}

export class LoginDto {
  @ApiProperty({
    default: "a4arpon@gmail.com",
  })
  @IsEmail()
  email: string

  @ApiProperty({
    default: "user-password",
  })
  @IsString()
  @MinLength(6)
  password: string
}

export class VerifyOTPDto {
  @ApiProperty({
    default: "a4arpon@gmail.com",
  })
  @IsEmail()
  email: string

  @ApiProperty({
    default: 123456,
  })
  @IsNumber()
  OTP: number
}
