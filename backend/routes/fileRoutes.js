import express from "express";
import upload from "../middlewares/fileUpload.js";
import authmiddleware from "../middlewares/authmiddleware.js";
import File from "../models/File.js";
import path from "path";

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

router.get("/", authmiddleware,  async (req,res) =>{
  try {
    const userId1 = req.user.userId;

    const files = await File.find({owner:userId1}).select("originalName fileSize fileType createdAt").sort({createdAt:-1});

    res.status(200).json({files});
    
  } catch (error) {
    console.log(error);
    res.status(500).json({message:"Server Error!"});
    
  }
});

router.get("/:id",authmiddleware, async(req,res) =>{
  const file = await File.findById(req.params.id);

  if(!file){
    return res.status(404).json({message:"File not found!!"});
  }
  if(file.owner.toString() !== req.user.userId){
    return res.status(403).json({message:"Access Denied!"});
  }

  const filepath = path.resolve("uploads",file.storedName);
  res.download(filepath,file.originalName);
})

export default router;
