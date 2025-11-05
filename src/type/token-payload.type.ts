import { ObjectId } from 'mongoose';

export interface TokenPayload {
  email: string;
  userId: ObjectId;
  name?: string;
  jti?: string;
  iat?: number;
}
