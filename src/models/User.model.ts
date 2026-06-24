import mongoose, { Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  image?: string;
  githubUsername?: string;
  githubBio?: string;
  githubUrl?: string;
  githubAccessToken?: string;
  skills: string[];
  status:
    | "AVAILABLE"
    | "BUSY"
    | "LOOKING_FOR_TEAM"
    | "LOOKING_FOR_PROJECT";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    image: String,
    githubUsername: String,
    githubBio: String,
    githubUrl: String,
    githubAccessToken: String,
    skills: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: [
        "AVAILABLE",
        "BUSY",
        "LOOKING_FOR_TEAM",
        "LOOKING_FOR_PROJECT",
      ],
      default: "AVAILABLE",
    },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;