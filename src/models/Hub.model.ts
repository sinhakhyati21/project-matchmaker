import mongoose, { Document, Model } from "mongoose";

export interface IHub extends Document {
  project: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
}

const HubSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      unique: true,
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Hub: Model<IHub> =
  mongoose.models.Hub ||
  mongoose.model<IHub>("Hub", HubSchema);

export default Hub;