const { connect, baseurl } = require('../../config/db.config');
//const logger = require('../../logger/api.logger');
const { QueryTypes, Sequelize, Model, DataTypes, Op } = require('sequelize');
//const helper = require('../utility/helper'); 
const utility = require('../../utility/utility');
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);
const axios = require('axios');
const moment = require('moment'); // install moment or dayjs
const uploadFileToB2 = require('../../utility/b2Upload.utility'); // new B2 uploader
const path = require('path');
require('dotenv').config();
// const baseUrl = process.env.API_BASE_URL;
class Banner {

  db = {};

  constructor() {
    this.db = connect();

  }

  async getBannerOld(req, res) {

    try {

      let bannerCategories = await this.db.bannerCategory.getBannerCategory();

      let bannersByCategory = {};

      for (const category of bannerCategories) {


        const categoryId = category.id;
        const categoryName = category.category_name;
        let bannerList = [];

        let banners = await this.db.banner.getBanner(categoryId);

        bannersByCategory[categoryName] = banners.map((bannerItem) => ({
          id: bannerItem.id,
          title: bannerItem.title,
          img: baseurl + bannerItem.img,
          type_id: bannerItem.type_id,
          banner_for: bannerItem.banner_for,
        }));

      }

      const banner_data = Object.keys(bannersByCategory).reduce((result, categoryName) => {
        result[categoryName] = bannersByCategory[categoryName];
        return result;
      }, {});

      if (Object.keys(banner_data).length > 0) {
        return res.status(200).json({ status: 200, message: 'Banners Found', data: banner_data });
      } else {
        return res.status(401).json({ status: 401, token: '', message: 'Banners Not Found', data: [] });
      }


    }
    catch (err) {
      logger.error(`Unable to find Banner: ${err}`);
      if (err.name === 'SequelizeValidationError') {
        const validationErrors = err.errors.map((err) => err.message);
        return res.status(500).json({ status: 500, errors: validationErrors });
      }
      return res.status(500).json({ status: 500, token: '', message: err, data: [] });
    }

  }



  async getBanner(req, res) {

    const decryptedObject = utility.DataDecrypt(req.encReq);
    const { categoryId } = decryptedObject;

    const requiredKeys = Object.keys({ categoryId });

    if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined)) {
      return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
    }

    try {

      let banners = await this.db.banner.getBanner(categoryId);

      const result = banners.map((bannerItem) => ({
        id: bannerItem.id,
        title: bannerItem.title,
        img: baseurl + bannerItem.img,
        type_id: bannerItem.type_id,
        banner_for: bannerItem.banner_for,
      }));


      if (result) {
        return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Banners Found', data: result })));
      } else {
        return res.status(401).json(utility.DataEncrypt(JSON.stringify({ status: 401, token: '', message: 'Banners Not Found', data: [] })));
      }


    }
    catch (err) {
      logger.error(`Unable to find Banner: ${err}`);
      if (err.name === 'SequelizeValidationError') {
        const validationErrors = err.errors.map((err) => err.message);
        return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, errors: validationErrors })));
      }
      return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, token: '', message: err, data: [] })));
    }

  }

  async getBannerReport(req, res) {
    try {
      const { from_date, to_date } = req.body;

      const startDate = moment(from_date).startOf("day").toDate();
      const endDate = moment(to_date).endOf("day").toDate();

      // console.log("startDate:", startDate);
      // console.log("endDate:", endDate);

      const whereCondition = {
        status: { [Op.or]: [1, 2] },
        created_on: { [Op.between]: [startDate, endDate] },
      };

      // ✅ Fetch from tbl_banners
      const banners = await this.db.banner.findAll({
        where: whereCondition,
        order: [["created_on", "DESC"]],
      });

      // console.log("banners:", banners);

      const bannerResult = banners.map((bannerItem) => ({
        id: bannerItem.id,
        title: bannerItem.title,
        img: bannerItem.img,
        type_id: bannerItem.type_id,
        banner_for: bannerItem.banner_for,
        created_on: bannerItem.created_on,
        status: bannerItem.status,
        app_id: bannerItem.app_id,
      }));

      const report = {
        total_count: await this.db.banner.count({ where: whereCondition }),
        total_active: await this.db.banner.count({
          where: { ...whereCondition, status: 1 },
        }),
        total_inactive: await this.db.banner.count({
          where: { ...whereCondition, status: 2 },
        }),
        total_deleted: await this.db.banner.count({
          where: { ...whereCondition, status: 0 },
        }),
      };

      return res.status(200).json({
        status: 200,
        message: bannerResult.length > 0 ? "Banners Found" : "Banners Not Found",
        data: bannerResult,
        report,
      });
    } catch (err) {
      logger.error(`Unable to find Banner: ${err}`);
      if (err.name === "SequelizeValidationError") {
        const validationErrors = err.errors.map((e) => e.message);
        return res.status(500).json({ status: 500, errors: validationErrors });
      }
      return res
        .status(500)
        .json({ status: 500, message: err.message || err, data: [] });
    }
  }
  async getBannerReportbycategory(req, res) {
    try {
      const { type_id } = req.body;

      // Build where condition
      const whereCondition = {
        status: { [Op.or]: [1, 2] },
      };

      // Add type_id filter if provided
      if (type_id) {
        whereCondition.type_id = type_id;
      }

      // Fetch banners
      const banners = await this.db.banner.findAll({
        where: whereCondition,
        order: [["created_on", "DESC"]],
      });

      const bannerResult = banners.map((bannerItem) => ({
        id: bannerItem.id,
        title: bannerItem.title,
        img: bannerItem.img,
        type_id: bannerItem.type_id,
        banner_for: bannerItem.banner_for,
        created_on: bannerItem.created_on,
        status: bannerItem.status,
        app_id: bannerItem.app_id,
      }));

      const report = {
        total_count: await this.db.banner.count({ where: whereCondition }),
        total_active: await this.db.banner.count({
          where: { ...whereCondition, status: 1 },
        }),
        total_inactive: await this.db.banner.count({
          where: { ...whereCondition, status: 2 },
        }),
        total_deleted: await this.db.banner.count({
          where: { ...whereCondition, status: 0 },
        }),
      };

      return res.status(200).json({
        status: 200,
        message: bannerResult.length > 0 ? "Banners Found" : "Banners Not Found",
        data: bannerResult,
        report,
      });
    } catch (err) {
      logger.error(`Unable to find Banner: ${err}`);
      if (err.name === "SequelizeValidationError") {
        const validationErrors = err.errors.map((e) => e.message);
        return res.status(500).json({ status: 500, errors: validationErrors });
      }
      return res
        .status(500)
        .json({ status: 500, message: err.message || err, data: [] });
    }
  }


  async updateBannerStatus(req, res) {
    const { id, action, status } = req;


    const requiredKeys = Object.keys({ id, action, status });

    if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined)) {
      return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
    }

    let t;

    try {

      const currentDate = new Date();
      const modified_on = currentDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');

      const updatedStatus = await this.db.banner.UpdateData(
        {
          // rejection_reason:note,
          status,
          modified_on: modified_on
        },

        { id: id }

      );

      if (updatedStatus > 0) {
        return res.status(200).json({ status: 200, message: 'Banner Status Updated Successful.' });
      } else {
        return res.status(500).json({ status: 500, message: 'Failed to Update data', data: [] });
      }

    } catch (error) {
      logger.error(`Unable to find Banner: ${error}`);
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map((err) => err.message);
        return res.status(500).json({ status: 500, errors: validationErrors });
      }

      return res.status(500).json({ status: 500, message: error, data: [] });
    }
  }

  async getBannerCategory(req, res) {

    try {

      let bannersCategory = await this.db.bannerCategory.getBannerCategory();


      const notificationApp = await this.db.notificationAppType.getAllData();


      if (bannersCategory && notificationApp) {
        return res.status(200).json({ status: 200, message: 'Category Found', data: { bannersCategory, notificationApp } });
      } else {
        return res.status(401).json({ status: 401, token: '', message: 'Category Not Found', data: [] });
      }

    }
    catch (err) {
      logger.error(`Unable to find Category: ${err}`);
      if (err.name === 'SequelizeValidationError') {
        const validationErrors = err.errors.map((err) => err.message);
        return res.status(500).json({ status: 500, errors: validationErrors });
      }
      return res.status(500).json({ status: 500, token: '', message: err, data: [] });
    }

  }

  // this is for uploading on the blackbenz
  async addBanner(req, res) {
    try {
      const { title, categoryId, app_id } = req.body;

      if (!title || !categoryId) {
        return res.status(400).json({
          status: 400,
          message: "Required input data is missing",
        });
      }

      // Upload file to B2
      const bannerUpload = await uploadFileToB2.uploadBanner(req.file);

      // Generate a signed URL for the uploaded file
      const signedUrl = await uploadFileToB2.getPrivateFileUrl(
        { fileName: bannerUpload.fileName },   // ✅ expects { fileName }
        7 * 24 * 60 * 60                       // 7 days
      );

      const result = await this.db.banner.insertData({
        type_id: categoryId,
        title,
        app_id,
        img: signedUrl,
        banner_for: "App",
        created_on: new Date().toISOString().replace("T", " ").replace(/\.\d{3}Z$/, ""),
      });

      if (result) {
        return res.status(200).json({
          status: 200,
          message: "Banner uploaded successfully",
          url: signedUrl,
        });
      } else {
        return res.status(500).json({ status: 500, message: "Failed to save data" });
      }
    } catch (error) {
      return res.status(500).json({ status: 500, message: error.message });
    }
  }

  async getAllBannerImages(req, res) {
    try {
      const images = await uploadFileToB2.listOfBannerImg();
      return res.status(200).json({
        status: 200,
        message: "Banner images fetched successfully",
        data: images,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: "Failed to fetch banner images",
        error: error.message,
      });
    }
  }


}




module.exports = new Banner();