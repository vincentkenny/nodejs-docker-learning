const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");

const ProductController = require('../controllers/products');

const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  //reject file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else cb(null, false);
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter,
});

const Product = require("../models/products");

router.get("/", ProductController.products_get_all);

router.post("/", checkAuth,  upload.single("productImage"), ProductController.products_create_product);

router.get("/:productID", ProductController.products_get_product);

router.patch("/:productID", checkAuth, ProductController.products_update_product);

router.delete("/:productID", checkAuth, ProductController.products_delete_product);

module.exports = router;
