const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth-middleware");
const adminMiddleware = require("../middleware/admin-middleware");
const uploadMiddleware = require("../middleware/upload-middleware"); // Assuming you have a middleware for handling file uploads
const {
  uploadImageController,
  fetchImagesController,
  deleteImageController,
} = require("../controllers/image-controller");
router.post(
  "/upload",
  authMiddleware,
  adminMiddleware,
  uploadMiddleware.single("image"),
  uploadImageController
);
router.get("/get", authMiddleware, fetchImagesController);
router.delete("/:id", authMiddleware, adminMiddleware, deleteImageController);
module.exports = router;
