// routes/primeUserRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../../middleware/multer");
const PrimeUserRequestController = require("../../controller/prime_request/PrimeUserRequest.controller");

// Create request with multiple images
router.post(
  "/prime-requests",
  PrimeUserRequestController.uploadMiddleware,
  PrimeUserRequestController.createRequest
);

// Get all requests
router.get("/prime-requests", PrimeUserRequestController.getAllRequests);

// Update status (approve/reject)
router.post("/prime-requests/:id", PrimeUserRequestController.updateStatus);

router.get("/userrequest/:id", PrimeUserRequestController.getUserRequests);

module.exports = router;
