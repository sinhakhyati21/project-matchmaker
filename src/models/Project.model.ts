import mongoose, { Document, Model } from "mongoose";

export interface IProject extends Document {
  title: string;
  description: string;
  category: string;
  requiredSkills: string[];
  requiredRoles: string[];
  maxTeamSize: number;
  status: "RECRUITING" | "ACTIVE" | "COMPLETED" | "ARCHIVED";
  owner: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new mongoose.Schema<IProject>(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    requiredSkills: {
      type: [String],
      default: [],
    },

    requiredRoles: {
      type: [String],
      default: [],
    },

    maxTeamSize: {
      type: Number,
      required: true,
      min: 2,
    },

    status: {
      type: String,
      enum: ["RECRUITING", "ACTIVE", "COMPLETED", "ARCHIVED"],
      default: "RECRUITING",
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Project: Model<IProject> =
  mongoose.models.Project ||
  mongoose.model<IProject>("Project", ProjectSchema);

export default Project;