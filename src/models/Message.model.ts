import mongoose, { Document, Model } from "mongoose";

export interface IMessage extends Document {
  hub: mongoose.Types.ObjectId;
  project: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  content: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new mongoose.Schema<IMessage>(
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

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    imageUrl: String,
  },
  {
    timestamps: true,
  }
);

const Message: Model<IMessage> =
  mongoose.models.Message ||
  mongoose.model<IMessage>("Message", MessageSchema);

export default Message;