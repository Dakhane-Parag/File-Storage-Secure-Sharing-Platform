import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    originalName: {
      type: String,
      required: true
    },

    storedName: {
      type: String,
      required: true
    },

    fileSize: {
      type: Number,
      required: true
    },

    fileType: {
      type: String,
      required: true
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

const File = mongoose.model("File", fileSchema);

export default File;
