import mongoose from "mongoose";

const shareLinkSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true
    },

    file: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
      required: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    expiresAt: {
      type: Date,
      required: true
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const ShareLink = mongoose.model("ShareLink", shareLinkSchema);

export default ShareLink;
