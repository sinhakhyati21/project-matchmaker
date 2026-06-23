import mongoose, { Document, Model } from "mongoose";

export interface IDiscussionReply {
  author: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
}

export interface IDiscussion extends Document {
  hub: mongoose.Types.ObjectId;
  project: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  title: string;
  content: string;
  replies: IDiscussionReply[];
  createdAt: Date;
  updatedAt: Date;
}

const DiscussionSchema = new mongoose.Schema<IDiscussion>(
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

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    replies: [
      {
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        content: {
          type: String,
          required: true,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Discussion: Model<IDiscussion> =
  mongoose.models.Discussion ||
  mongoose.model<IDiscussion>("Discussion", DiscussionSchema);

export default Discussion;