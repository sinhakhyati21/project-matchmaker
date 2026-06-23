import mongoose, { Document, Model } from "mongoose";

export interface IInvitation extends Document {
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  project: mongoose.Types.ObjectId;
  status: "PENDING" | "ACCEPTED" | "DECLINED";
  createdAt: Date;
  updatedAt: Date;
}

const InvitationSchema = new mongoose.Schema<IInvitation>(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiver: {
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
      enum: ["PENDING", "ACCEPTED", "DECLINED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);

InvitationSchema.index(
  {
    receiver: 1,
    project: 1,
  },
  {
    unique: true,
  }
);

const Invitation: Model<IInvitation> =
  mongoose.models.Invitation ||
  mongoose.model<IInvitation>("Invitation", InvitationSchema);

export default Invitation;