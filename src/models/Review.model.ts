import mongoose, { Document, Model } from "mongoose";

export interface IReview extends Document {
  project: mongoose.Types.ObjectId;
  reviewer: mongoose.Types.ObjectId;
  reviewee: mongoose.Types.ObjectId;
  communication: number;
  technicalSkills: number;
  reliability: number;
  teamwork: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new mongoose.Schema<IReview>(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    communication: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    technicalSkills: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    reliability: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    teamwork: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: String,
  },
  {
    timestamps: true,
  }
);

ReviewSchema.index(
  {
    project: 1,
    reviewer: 1,
    reviewee: 1,
  },
  {
    unique: true,
  }
);

const Review: Model<IReview> =
  mongoose.models.Review ||
  mongoose.model<IReview>("Review", ReviewSchema);

export default Review;