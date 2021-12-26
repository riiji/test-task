import { model, Schema } from 'mongoose';

export interface Photo {
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
  createdAt: number;
  updatedAt: number;
}

export interface Album {
  id: number;
  title: string;
  photos: Photo[];
  createdAt: number;
  updatedAt: number;
}

export interface User {
  email: string;
  login: string;
  passwordHash: string;
  avatar?: string;
  albums: Album[];
  createdAt: number;
  updatedAt: number;
}

export const photoSchema = new Schema<Photo>({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  url: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
});

export const albumSchema = new Schema<Album>({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  photos: [photoSchema],
});

export const userSchema = new Schema<User>({
  email: { type: String, required: true },
  login: { type: String, required: true },
  passwordHash: { type: String, required: true },
  albums: [albumSchema],
  avatar: String,
  createdAt: { type: Number, default: Date.now() },
});

export const UserModel = model<User>('User', userSchema);
