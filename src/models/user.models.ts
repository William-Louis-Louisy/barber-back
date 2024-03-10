import bcrypt from "bcrypt";
import mongoose, { Schema } from "mongoose";
import { IUser } from "../interfaces/schemas.interfaces";

const UserSchema = new Schema<IUser>({
  mail: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  isAdmin: { type: Boolean },
});

// Middleware to hash password before saving
UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// STATIC METHODS
interface IUserModel extends mongoose.Model<IUser> {
  login(phone: string, password: string): Promise<IUser>;
}

UserSchema.statics.login = async function (phone: string, password: string) {
  const user = await this.findOne({ phone });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw new Error("Incorrect password");
  }
  throw new Error("Incorrect phone number");
};

export default mongoose.model<IUser, IUserModel>("User", UserSchema);
