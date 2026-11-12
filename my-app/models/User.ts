
import { Schema, model, models, HydratedDocument } from "mongoose";

export interface IUser {
  email: string;
  password: string;
  username: string;
}

export type IPublicUser = {
  id: string;
  username: string;
  email: string;
};

export type UserDocument = HydratedDocument<IUser>;

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  }
});

const User = models.User || model<IUser>("User", userSchema);

export default User;
