import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

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

  // Swagger

  @ApiProperty({
    description: 'Name of the user',
    required: true,
    type: String,
    example: 'John',
  })

  // mongoose
  @Prop({
    trim: true,
    type: String,
    required: [true, 'Name is required'],
  })

  // type definition
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Hashed password of the user',
    required: true,
    type: String,
  })
  @Prop({
    trim: true,
    type: String,
    required: [true, 'Password is required'],
  })
  @IsString()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
