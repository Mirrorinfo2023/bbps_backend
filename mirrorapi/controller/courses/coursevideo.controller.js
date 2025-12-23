const { connect } = require('../../config/db.config');
const utility = require('../../utility/utility'); // Your db connection

class CourseVideo1 {
  db = {};

  constructor() {
    this.db = connect();
  }

  // Add new course video
  async addCourseVideo(req, res) {
    const { title, category_id, video_link, status } = req.body;

    try {
      const [result] = await this.db.sequelize.query(
        `INSERT INTO tbl_course_video_details (title, category_id, video_link, status) 
         VALUES (:title, :category_id, :video_link, :status)`,
        {
          replacements: { title, category_id, video_link, status },
          type: this.db.sequelize.QueryTypes.INSERT
        }
      );

      return res.status(201).json({
        status: 201,
        message: "Video added successfully",
        data: result // result is the insertId
      });
    } catch (error) {
      console.error("Error in addCourseVideo:", error);
      return res.status(500).json({ status: 500, message: "Internal server error" });
    }
  }

  // Update video details
  async updateVideoCourse(req, res) {
    const { video_id, title, category_id, video_link, status } = req.body;

    try {
      const [result] = await this.db.sequelize.query(
        `UPDATE tbl_course_video_details 
         SET title = :title, category_id = :category_id, video_link = :video_link, status = :status 
         WHERE id = :video_id`,
        {
          replacements: { video_id, title, category_id, video_link, status },
          type: this.db.sequelize.QueryTypes.UPDATE
        }
      );

      if (result.affectedRows > 0 || result) {
        return res.status(200).json({ status: 200, message: "Video updated successfully" });
      } else {
        return res.status(404).json({ status: 404, message: "Video not found" });
      }
    } catch (error) {
      console.error("Error in updateVideoCourse:", error);
      return res.status(500).json({ status: 500, message: "Internal server error" });
    }
  }

  // Video interaction
  async videoInteraction(req, res) {
    const { video_id, user_id, type, comment_text } = req.body;

    try {
      const [result] = await this.db.sequelize.query(
        `INSERT INTO tbl_videocourse_interactions (video_id, user_id, type, comment_text) 
         VALUES (:video_id, :user_id, :type, :comment_text)`,
        {
          replacements: { video_id, user_id, type, comment_text },
          type: this.db.sequelize.QueryTypes.INSERT
        }
      );

      return res.status(200).json({ status: 200, message: "Interaction recorded successfully" });
    } catch (error) {
      console.error("Error in videoInteraction:", error);
      return res.status(500).json({ status: 500, message: "Internal server error" });
    }
  }

  // Get all course videos
// Get all course videos
  async getVideoCourses(req, res) {
    try {
      const { video_id } = req.body;  // optional

      let result;

      if (video_id) {
        // Fetch single course
        result = await this.db.videoCourseDetails.findOne({
          where: { id: video_id },
        });

        if (!result) {
          return res.status(404).json({
            status: 404,
            message: "Video not found",
            data: [],
          });
        }

        return res.status(200).json({
          status: 200,
          message: "success",
          data: result,
        });
      } else {
        // Fetch all courses
        result = await this.db.videoCourseDetails.findAll({
          order: [["created_on", "DESC"]], // optional: newest first
        });

        return res.status(200).json({
          status: 200,
          message: "All courses retrieved successfully",
          data: result,
        });
      }
    } catch (err) {
      console.error("Error in getVideoCourses:", err);

      if (err.name === "SequelizeValidationError") {
        const validationErrors = err.errors.map((e) => e.message);
        return res.status(500).json({ status: 500, errors: validationErrors });
      }

      return res.status(500).json({
        status: 500,
        message: "Internal server error",
        error: err.message,
        data: [],
      });
    }
  }

  // Get video details with interactions summary
  async getVideoDetails(req, res) {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ status: 400, message: "Video ID is required" });
    }

    try {
      // Video info
      const videoResultsArray = await this.db.sequelize.query(
        `SELECT * FROM tbl_course_video_details WHERE id = :video_id`,
        { replacements: { video_id: id }, type: this.db.sequelize.QueryTypes.SELECT }
      );

      if (videoResultsArray.length === 0) {
        return res.status(404).json({ status: 404, message: "Video not found" });
      }

      const videoResults = videoResultsArray[0];

      // Interactions summary
      const interactions = await this.db.sequelize.query(
        `SELECT type, user_id, comment_text, created_on 
       FROM tbl_videocourse_interactions 
       WHERE video_id = :video_id`,
        { replacements: { video_id: id }, type: this.db.sequelize.QueryTypes.SELECT }
      );

      const likes_count = interactions.filter(i => i.type === 'like').length;
      const unlikes_count = interactions.filter(i => i.type === 'unlike').length;
      const favorite_count = interactions.filter(i => i.type === 'favorite').length;
      const comments = interactions.filter(i => i.type === 'comment');

      const result = {
        ...videoResults,
        interactions_summary: { likes_count, unlikes_count, favorite_count, comments }
      };

      return res.status(200).json({ status: 200, message: "Video details retrieved successfully", data: result });

    } catch (error) {
      console.error("Error in getVideoDetails:", error);
      return res.status(500).json({ status: 500, message: "Internal server error" });
    }
  }

}


module.exports = new CourseVideo1();