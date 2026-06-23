import mongoose, { Document, Model } from "mongoose";

export interface IApplication extends Document {
  user: mongoose.Types.ObjectId;

  project: mongoose.Types.ObjectId;

  status:
    | "PENDING"
    | "ACCEPTED"
    | "REJECTED";

  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new mongoose.Schema<IApplication>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "ACCEPTED",
        "REJECTED",
      ],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate applications
ApplicationSchema.index(
  {
    user: 1,
    project: 1,
  },
  {
    unique: true,
  }
);

const Application: Model<IApplication> =
  mongoose.models.Application ||
  mongoose.model<IApplication>(
    "Application",
    ApplicationSchema
  );

export default Application;