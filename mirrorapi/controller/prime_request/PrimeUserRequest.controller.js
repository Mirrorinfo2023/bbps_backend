// controllers/PrimeUserRequestController.js
const { connect } = require("../../config/db.config");
const db = connect();
const { uploadMiddleware } = require('../../middleware/multer');
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);

// Create new request
const createRequest = async (req, res) => {
  try {
    const { user_id, sender_user_id, plan_id, amount, remark, utr_id } = req.body;

    // store image paths from multer
    const imagePaths = req.files ? req.files.map(f => "/uploads/prime_requests/" + f.filename) : [];

    const request = await db.PrimeUserRequest.create({
      user_id,
      sender_user_id,
      plan_id,
      amount,
      remark,
      utr_id: utr_id ? JSON.parse(utr_id) : null, // expecting array
      images: imagePaths,
      status: "pending"
    });

    res.status(201).json({ success: true, data: request });
  } catch (error) {
    console.error("Error creating PrimeUserRequest:", error);
    res.status(500).json({ success: false, message: "Failed to create request" });
  }
};
const getAllRequests = async (req, res) => {
  try {
    const { user_id } = req.body; // take user_id from request body

    // Base query
    let rawQuery = `
      SELECT 
        pur.*, 
        u.id AS user_id,
        u.first_name,
        u.last_name,
        u.username,
        u.email,
        u.mobile,
        u.mlm_id,
        u.referred_by
      FROM tbl_prime_user_request AS pur
      LEFT JOIN tbl_app_users AS u
        ON pur.user_id = u.id
    `;

    // Add WHERE clause if user_id exists
    if (user_id) {
      rawQuery += ` WHERE pur.user_id = :user_id `;
    }

    // Order by createdAt
    rawQuery += ` ORDER BY pur.createdAt DESC`;

    const requests = await db.sequelize.query(rawQuery, {
      type: db.sequelize.QueryTypes.SELECT,
      replacements: { user_id } // safely bind parameter
    });

    const requestsWithFullImage = requests.map(reqItem => {
      let images = [];

      if (Array.isArray(reqItem.images)) {
        images = reqItem.images;
      } else if (typeof reqItem.images === "string" && reqItem.images.trim() !== "") {
        try {
          // If stored as JSON string in DB
          images = JSON.parse(reqItem.images);
        } catch (e) {
          // If stored as comma-separated string
          images = reqItem.images.split(",");
        }
      }

      return {
        ...reqItem,
        image_url: images
      };
    });

    res.json({ success: true, data: requestsWithFullImage });
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch requests' });
  }
};



// Approve/Reject request
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    const request = await db.PrimeUserRequest.findByPk(id);
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });

    request.status = status;
    if (status === "rejected") request.reason = reason;
    await request.save();

    res.json({ success: true, data: request });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ success: false, message: "Failed to update request" });
  }
};

const getUserRequests = async (req, res) => {

  try {

    let user_id = req.params.id;

    logger.info(`Fetching requests for user_id: ${user_id}`);
    // Ensure user_id is a number (prevents type mismatch)
    user_id = Number(user_id);

    if (!user_id) {
      logger.error("Invalid or missing user_id");
      return res.status(400).json({ success: false, message: "user_id is required" });
    }

    // Query only that user
    const rawQuery = `
      SELECT 
        pur.*, 
        u.id AS user_id,
        u.first_name,
        u.last_name,
        u.username,
        u.email,
        u.mobile,
        u.mlm_id,
        u.referred_by
      FROM tbl_prime_user_request AS pur
      LEFT JOIN tbl_app_users AS u
        ON pur.user_id = u.id
      WHERE pur.user_id = :user_id
      ORDER BY pur.createdAt DESC
    `;

    const requests = await db.sequelize.query(rawQuery, {
      type: db.sequelize.QueryTypes.SELECT,
      replacements: { user_id }
    });

    // Parse images safely
    const requestsWithImages = requests.map(reqItem => {
      let images = [];
      if (reqItem.images) {
        try {
          images = Array.isArray(reqItem.images)
            ? reqItem.images
            : JSON.parse(reqItem.images); // in case it's stored as JSON string
        } catch (err) {
          images = [reqItem.images]; // fallback if single string
        }
      }

      return { ...reqItem, image_url: images };
    });

    res.json({ success: true, data: requestsWithImages });
  } catch (error) {
    console.error("Error fetching user requests:", error);
    res.status(500).json({ success: false, message: "Failed to fetch user requests" });
  }
};



module.exports = {
  createRequest,
  getAllRequests,
  updateStatus,
  getUserRequests,
  uploadMiddleware // use the correct one
};
