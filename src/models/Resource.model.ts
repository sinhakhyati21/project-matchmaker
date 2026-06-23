import mongoose, { Document, Model } from "mongoose";

export interface IResource extends Document {
  hub: mongoose.Types.ObjectId;
  project: mongoose.Types.ObjectId;
  title: string;
  url: string;
  type: "GITHUB" | "DESIGN" | "DOCS" | "PRESENTATION" | "OTHER";
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ResourceSchema = new mongoose.Schema<IResource>(
  {
    hub: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hub",
      required: true,
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    url: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["GITHUB", "DESIGN", "DOCS", "PRESENTATION", "OTHER"],
      default: "OTHER",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Resource: Model<IResource> =
  mongoose.models.Resource ||
  mongoose.model<IResource>("Resource", ResourceSchema);

export default Resource;