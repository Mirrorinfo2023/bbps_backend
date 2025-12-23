const express = require('express');
const path = require("path");
const categoriesController = require('../../controller/courses/coursecategories.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');
const multer = require("multer");
const { configureMulter } = require('../../utility/upload.utility');

const leadsCategories = express.Router();
// const upload = multer({ dest: "uploads/category" });

const upload = configureMulter((req) => {
  const categoryName = req.body.category_name; // assuming category name comes in request body
  if (!categoryName) throw new Error("Category name is required");

  // Build path: project_root/uploads/category/<category_name>
  return path.join(process.cwd(), "uploads", "category", categoryName);
});

const endpoints = {
    '/addcategory': 'e8c972c374e0499787cf9a6674ee95ba94e2731f',
    '/getAllcategory': '006db6cc97a5160392932874bf6539ad2f0caea4',
    '/getchildcategory': '2ffbd5ac811ff7360bd1599ac7eaf56b689da024',
    '/get-video-category': 'c5e745c59ec5219f05683fb31d419d41f431d61e',
    '/update-status-category': '081c13d3d222eff121b42d31a246e368acdf5c4a',
    '/update-video-category': 'b234bc654e925e853866831a6430b243ff46bb39'
};

// Add new category
leadsCategories.post(
    '/addcategory',
    logMiddleware,
    upload.single("image"),       // <-- multer handles the file upload
    (req, res) => categoriesController.addCategory(req, res)
);


leadsCategories.post('/getAllcategory', logMiddleware, (req, res) => {

    categoriesController.getCategory(req.body, res).then(data => res.json(data));
});

leadsCategories.post('/getchildcategory', logMiddleware, (req, res) => {

    categoriesController.getChildCategory(req.body, res).then(data => res.json(data));
});



module.exports = leadsCategories;
