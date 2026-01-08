import express from "express";
import upload from "../middlewares/fileUpload.js";
import authmiddleware from "../middlewares/authmiddleware.js";
import File from "../models/File.js";

const router = express.Router();

router.post(
  "/upload",
  authmiddleware,
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const file = await File.create({
        originalName: req.file.originalname,
        storedName: req.file.filename,
        fileSize: req.file.size,
        fileType: req.file.mimetype,
        owner: req.user.userId,
      });

      res.status(201).json({
        message: "File uploaded successfully",
        file: {
          id: file._id,
          originalName: file.originalName,
          fileSize: file.fileSize,
          fileType: file.fileType,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "File upload failed" });
    }
  }
);

export default router;
