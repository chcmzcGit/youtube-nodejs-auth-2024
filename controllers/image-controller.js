const Image = require("../models/Image");
const { uploadToCloudinary } = require("../helpers/cloudinaryHelper");
const fs = require("fs");
const cloudinary = require("cloudinary");
const uploadImageController = async (req, res) => {
  try {
    const { file } = req;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { url, publicId } = await uploadToCloudinary(file.path);
    const newImage = new Image({
      url,
      publicId,
      uploadBy: req.userInfo.userId,
    });
    await newImage.save();
    fs.unlinkSync(file.path); // Delete the file from local storage after uploading to Cloudinary
    res.status(201).json({
      message: "Image uploaded successfully",
      image: newImage,
    });
  } catch (error) {
    res.status(500).json({ message: "Error uploading image", error });
  }
};

const fetchImagesController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const totalImages = await Image.countDocuments();
    const totalPages = Math.ceil(totalImages / limit);
    const sortObj = {};
    sortObj[sortBy] = sortOrder;

    // const images = await Image.find({ uploadBy: req.userInfo.userId });
    const images = await Image.find().sort(sortObj).skip(skip).limit(limit);
    if (!images || images.length === 0) {
      return res.status(404).json({ message: "No images found" });
    }
    res.status(200).json({
      data: images,
      currentPage: page,
      totalPages: totalPages,
      totalImages: totalImages,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching images", error });
  }
};

const deleteImageController = async (req, res) => {
  try {
    const imageId = req.params.id;
    const image = await Image.findById(imageId);
    const userId = req.userInfo.userId;
    if (image.uploadBy.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }
    // Delete from Cloudinary
    await cloudinary.uploader.destroy(image.publicId);
    // Delete from database
    await Image.findByIdAndDelete(imageId);
    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting image", error });
  }
};

module.exports = {
  uploadImageController,
  fetchImagesController,
  deleteImageController,
};
