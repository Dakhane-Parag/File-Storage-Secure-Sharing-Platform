import express from "express";
import authmiddleware from "../middlewares/authmiddleware.js";
import crypto from "crypto";
import File from "../models/File.js";
import ShareLink from "../models/ShareLink.js";
import path from "path";
import fs from "fs";

const router = express.Router();

router.post("/:fileId", authmiddleware, async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);
    if (!file) {
      return res.status(404).json({ message: "File not found!!" });
    }

    if (file.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Access Denied!!" });
    }

    const token = crypto.randomBytes(20).toString("hex");

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const shareLink = await ShareLink.create({
      token,
      file: file._id,
      createdBy: req.user.userId,
      expiresAt,
      isActive: true,
    });

    res.status(201).json({
      shareUrl: `/share/${token}`,
      message: "Share link created",
      expiresAt,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create a sharelink!!" });
  }
});

router.get("/public/:token", async (req, res) => {
  try {
    const shareLink = await ShareLink.findOne({
      token: req.params.token,
      isActive: true,
    }).populate("file");

    if (!shareLink) {
      return res.status(404).json({ message: "Invalid share link!" });
    }

    if (shareLink.expiresAt < new Date()) {
      return res.status(410).json({ message: "ShareLink has expired!" });
    }

    const filepath = path.resolve("uploads", shareLink.file.storedName);

    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ message: "File not found!" });
    }
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${shareLink.file.originalName}"`
    );

    const stream = fs.createReadStream(filepath);
    stream.pipe(res);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to access the shared file!" });
  }
});

router.patch("/:token/revoke", authmiddleware, async (req, res) => {
  try {
    const shareLink = await ShareLink.findOne({ token: req.params.token });
    if (!shareLink) {
      res.status(404).json({ message: "sharelink not found!!" });
    }
    if (shareLink.createdBy.toString() != req.user.userId) {
      res.status(403).json({ message: "Access Denied!!" });
    }
    shareLink.isActive = false;
    await shareLink.save();

    res.status(200).json({ message: "ShareLink revoked successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to revoke the sharelink!" });
  }
});

router.get("/public/:token/meta", async (req, res) => {
  try {
    const shareLink = await ShareLink.findOne({
      token: req.params.token,
      isActive: true,
    }).populate("file");

    if (!shareLink) {
      return res.status(404).json({ message: "Invalid share link" });
    }

    if (shareLink.expiresAt < new Date()) {
      return res.status(410).json({ message: "Share link expired" });
    }

    return res.json({
      fileName: shareLink.file.originalName,
      expiresAt: shareLink.expiresAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch metadata" });
  }
});


export default router;
