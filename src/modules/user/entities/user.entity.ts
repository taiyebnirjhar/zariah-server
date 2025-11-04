import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString } from 'class-validator';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Schema({
  timestamps: true,
  collection: 'user',
})
export class User {
  @ApiProperty({
    description: 'Email of the user',
    required: true,
    type: String,
    example: 'user@example.com',
  })
  @Prop({
    trim: true,
    type: String,
    unique: true,
    required: [true, 'Email is required'],
  })
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({
    description: 'First name of the user',
    required: false,
    type: String,
    example: 'John',
  })
  @Prop({
    type: String,
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the user',
    required: false,
    type: String,
    example: 'Doe',
  })
  @Prop({
    type: String,
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Profile image URL of the user',
    required: false,
    type: String,
    example: 'https://example.com/image.jpg',
  })
  @Prop({
    type: String,
  })
  @IsString()
  image?: string;

  @ApiProperty({
    description: 'Hashed password of the user',
    required: false,
    type: String,
  })
  @Prop({
    type: String,
  })
  @IsString()
  password?: string;

  @ApiProperty({
    description: 'Role of the user',
    required: true,
    enum: UserRole,
    default: UserRole.USER,
    example: UserRole.USER,
  })
  @Prop({
    type: String,
    enum: UserRole,
    required: true,
    default: UserRole.USER,
  })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({
    description: 'Refresh token for authentication',
    required: false,
    type: String,
  })
  @Prop({
    type: String,
  })
  @IsString()
  refreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
