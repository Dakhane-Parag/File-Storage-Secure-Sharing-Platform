import express from "express";
import authmiddleware from "../routes/authmiddleware.js";
import crypto from "crypto";
import File from "../models/File.js";
import ShareLink from "../models/ShareLink.js"; 


const router = express.Router();

router.post("/:fileId",authmiddleware, async(req,res) =>{
  try {
    const file = await File.findById(req.params.fileId);
    if(!file){
      return res.status(404).json({message:"File not found!!"});
    }

    if(file.owner.toString() !== req.user.userId){
      return res.status(403).json({message:"Access Denied!!"});
    }

    const token = crypto.randomBytes(20).toString("hex");

    const expiresAt = new Date(Date.now() + 24*60*60*1000);

    const shareLink = await ShareLink.create({
      token,
      file:file._id,
      createdBy:req.user.userId,
      expiresAt,
      isActive:true
    });

    res.status(201).json({
      message: "Share link created",
      shareUrl: `/share/${token}`,
      expiresAt,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({message:"Failed to create a sharelink!!"});
  }
});





export default router;
