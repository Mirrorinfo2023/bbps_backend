const { connect, baseurl } = require('../../config/db.config');
//const logger = require('../../logger/api.logger');
const { secretKey } = require('../../middleware/config');
const { QueryTypes, Sequelize, Model, DataTypes, Op } = require('sequelize');
const jwt = require('jsonwebtoken');
//const helper = require('../utility/helper'); 
const utility = require('../../utility/utility');
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);

const uploadFileToB2 = require("../../utility/b2Upload.utility");

class ServicesOperator1 {

  db = {};

  constructor() {
    this.db = connect();

  }


  async addCategory(req, res) {
    let t;
    try {
      const { category_name, description, category_id } = req.body;
      const user_id = req.user?.id || null;

      // --- Step 1: Validate ---
      if (!category_name || category_name.trim() === "") {
        return res.status(400).json({
          status: 400,
          message: "Category name is required",
          fields: ["category_name"]
        });
      }

      t = await this.db.sequelize.transaction();

      // --- Step 2: Check duplicate ---
      const existingCategory = await this.db.videoCategories.getDataWithClause(category_name);
      if (existingCategory.length > 0) {
        await t.rollback();
        return res.status(400).json({
          status: 400,
          message: "Category already exists"
        });
      }

      // --- Step 3: Upload image to B2 ---
      let signedUrl = null;
      if (req.file) {
        // Upload category image
        const uploadResult = await uploadFileToB2.uploadCategoryImage(req.file);

        // Generate signed URL valid for 7 days
        signedUrl = await uploadFileToB2.getPrivateFileUrl(
          { fileName: uploadResult.fileName },
          7 * 24 * 60 * 60 // 7 days
        );
      }

      // --- Step 4: Insert category ---
      const categoryData = {
        category_name,
        category_description: description || "",
        img: signedUrl, // save signed URL
        parent_id: category_id || 0,
        created_by: user_id,
        created_on: new Date().toISOString().replace("T", " ").replace(/\.\d{3}Z$/, "")
      };

      const newCategory = await this.db.videoCategories.insertData(categoryData, {
        validate: true,
        transaction: t,
        logging: sql => logger.info(sql)
      });

      await t.commit();

      return res.status(201).json({
        status: 201,
        message: "Category added successfully",
        data: newCategory
      });

    } catch (error) {
      if (t) await t.rollback();
      logger.error(`Error in addCategory: ${error}`);
      return res.status(500).json({
        status: 500,
        message: error.message
      });
    }
  }


  async getCategory(req, res) {
    try {
      // Get all active categories without filtering by user, parent, or name
      const getCategory = await this.db.videoCategories.findAll({
        where: { status: 1 },
        order: [["id", "ASC"]],
      });

      console.log("getCategory ", getCategory)
      const filteredCategories = getCategory.map((category) => ({
        id: category.id,
        title: category.category_name,
        description: category.category_description || "",
        created_on: category.created_on,
        created_by: category.created_by,
        modified_on: category.modified_on,
        modified_by: category.modified_by,
        parent_id: category.parent_id,
        img: category.img
      }));

      return res.status(200).json({
        status: 200,
        message: "success",
        data: filteredCategories,
      });

    } catch (err) {
      logger.error(`Unable to find categories: ${err}`);
      return res.status(500).json({
        status: 500,
        message: err.message,
        data: [],
      });
    }
  }



  async getChildCategory(req, res) {
    try {
      const decryptedObject = utility.DataDecrypt(req.encReq);
      const { category_id } = decryptedObject;

      // Validate input
      if (!category_id || category_id === '') {
        return res.status(400).json(
          utility.DataEncrypt(
            JSON.stringify({
              status: 400,
              message: 'category_id is required'
            })
          )
        );
      }

      // Fetch direct children from DB
      const childCategories = await this.db.videoCategories.findAll({
        where: { parent_id: category_id, status: 1 },
        order: [['created_on', 'ASC']]
      });

      // Map only the required fields
      const childData = childCategories.map(cat => ({
        id: cat.id,
        category_name: cat.category_name,
        description: cat.description
      }));

      return res.status(200).json(
        utility.DataEncrypt(
          JSON.stringify({
            status: 200,
            message: 'success',
            data: childData
          })
        )
      );
    } catch (err) {
      logger.error(`Unable to find child categories: ${err}`);

      if (err.name === 'SequelizeValidationError') {
        const validationErrors = err.errors.map(e => e.message);
        return res.status(500).json(
          utility.DataEncrypt(
            JSON.stringify({
              status: 500,
              errors: validationErrors
            })
          )
        );
      }

      return res.status(500).json(
        utility.DataEncrypt(
          JSON.stringify({
            status: 500,
            message: err.message,
            data: []
          })
        )
      );
    }
  }


}


module.exports = new ServicesOperator1();