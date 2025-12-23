const { connect, baseurl } = require('../../config/db.config');
//const logger = require('../../logger/api.logger');
const { QueryTypes, Sequelize, Model, DataTypes, Op } = require('sequelize');
//const helper = require('../utility/helper'); 
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);
const axios = require('axios');
const utility = require('../../utility/utility');
const path = require('path');
require('dotenv').config();
const moment = require('moment'); // install if not already: npm i moment

class Meeting {

  db = {};

  constructor() {
    this.db = connect();

  }

  async addMeeting(req, res) {
    let t;

    const { meeting_name, meeting_link, description, meeting_date, meeting_time } = req.body;

    const created_by = req.user?.id; // make sure your auth middleware sets req.user

    // const meetingDateTime = moment(`${meeting_date} ${meeting_time}`, 'YYYY-MM-DD HH:mm:ss');


    // console.log("meetingDateTime ", meetingDateTime)
    // if (!meetingDateTime.isValid()) {
    //   return res.status(400).json({ status: 400, message: 'Invalid date/time format' });
    // }
    const requiredKeys = Object.keys({ meeting_name, meeting_link, description, meeting_date, meeting_time });


    try {
      const filePath = req.file;

      const path = 'uploads/meeting/';
      t = await this.db.sequelize.transaction();

      const Data = {
        name: meeting_name,
        meeting_link: meeting_link || null,
        description,
        meeting_date,
        meeting_time, // keep as string
        image: req.file ? path + file.filename : null,
        created_on: moment().format('YYYY-MM-DD HH:mm:ss'),
        created_by: created_by || null,

      };

      const newMeeting = await this.db.meeting.insertData(Data, {
        validate: true,
        transaction: t,
        logging: sql => logger.info(sql),
      });

      await t.commit();

      return res.status(201).json({ status: 201, message: 'meeting added successfully', data: newMeeting });

    } catch (error) {
      if (t) {
        await t.rollback();
      }

      logger.error(`Error in add Meeting: ${error}`);

      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map((err) => err.message);
        return res.status(500).json({ status: 500, errors: 'Internal Server Error', data: validationErrors });
      }

      return res.status(500).json({ status: 500, message: error.message, data: [] });
    }
  }

  // async addMeeting(req, res) {
  //   let t;

  //   const userid = req.user?.id; // User ID from token
  //   console.log("User ID from token:", userid);

  //   const {
  //     subject,
  //     meeting_name,
  //     description,
  //     meeting_date,
  //     meeting_time,
  //     duration,
  //     participants = [],
  //   } = req.body;

  //   console.log("Request body:", req.body);

  //   // Validate date & time
  //   const meetingDateTime = moment(`${meeting_date} ${meeting_time}`, 'YYYY-MM-DD HH:mm:ss');
  //   console.log("Parsed meetingDateTime:", meetingDateTime.format('YYYY-MM-DD HH:mm:ss'));

  //   if (!meetingDateTime.isValid()) {
  //     console.log("Invalid meeting date/time");
  //     return res.status(400).json({ status: 400, message: 'Invalid date/time format' });
  //   }

  //   // Prepare Zoho API request payload
  //   const zohoPayload = {
  //     topic: subject,
  //     start_time: meetingDateTime.toISOString(),
  //     duration,
  //     agenda: subject || `Scheduled by ${meeting_name}`,
  //     participants,
  //   };

  //   console.log("Zoho payload:", zohoPayload);

  //   try {
  //     t = await this.db.sequelize.transaction();
  //     console.log("Transaction started");

  //     // 1️⃣ Call Zoho API to create meeting
  //     const zohoResponse = await axios.post(
  //       `${process.env.ZOHO_MEETING_API_URL}`,
  //       zohoPayload,
  //       {
  //         headers: {
  //           'Authorization': `Zoho-oauthtoken ${process.env.ZOHO_ACCESS_TOKEN}`,
  //           'Content-Type': 'application/json',
  //         },
  //       }
  //     );

  //     console.log("Zoho API response status:", zohoResponse.status);
  //     console.log("Zoho API response data:", zohoResponse.data);

  //     if (zohoResponse.status !== 201 && zohoResponse.status !== 200) {
  //       console.log("Failed to create meeting on Zoho");
  //       return res.status(500).json({ status: 500, message: 'Failed to create meeting on Zoho' });
  //     }

  //     const meetingData = zohoResponse.data;

  //     // 2️⃣ Prepare DB insert data
  //     const Data = {
  //       name: meeting_name,
  //       description,
  //       meeting_date: meetingDateTime.format('YYYY-MM-DD HH:mm:ss'),
  //       meeting_time,
  //       meeting_link: meetingData.join_url || meetingData.meetingLink,
  //       status: 1,
  //       created_on: moment().format('YYYY-MM-DD HH:mm:ss'),
  //       created_by: userid || null,
  //       modified_on: null,
  //       modified_by: null,
  //       deleted_on: null,
  //       deleted_by: null,
  //     };

  //     console.log("Data to insert into DB:", Data);

  //     // 3️⃣ Save in DB
  //     const newMeeting = await this.db.meeting.insertData(Data, {
  //       validate: true,
  //       transaction: t,
  //       logging: sql => {
  //         console.log("SQL Query:", sql);
  //       },
  //     });

  //     console.log("New meeting saved in DB:", newMeeting);

  //     await t.commit();
  //     console.log("Transaction committed");

  //     // 4️⃣ Return meeting info
  //     return res.status(201).json({
  //       status: 201,
  //       message: 'Meeting created successfully on Zoho and saved in DB',
  //       data: { ...newMeeting, zohoData: meetingData },
  //     });

  //   } catch (error) {
  //     if (t) await t.rollback();
  //     console.error("Error in add Zoho Meeting:", error);

  //     return res.status(500).json({ status: 500, message: error.message, data: [] });
  //   }
  // }


  async meetingList(req, res) {
    const { from_date, to_date } = req;

    try {
      let whereCondition;

      const startDate = new Date(from_date);
      const endDate = new Date(to_date);
      endDate.setHours(23, 59, 59);

      whereCondition = {
        'created_on': {
          [Op.between]: [startDate, endDate]
        },
      }
      const result = await this.db.meeting.getAllData(whereCondition);

      const meetingResult = [];

      for (const item of result) {

        meetingResult.push({

          ...item.dataValues,
          image: baseurl + item.image,
        });
      }


      return res.status(200).json({ status: 200, message: 'success', data: meetingResult });

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

  async upcomming_meetings(req, res) {
    try {
      const now = new Date(); // current date & time

      // Get all meetings from now onward
      const whereCondition = {
        meeting_date: {
          [Op.gte]: now, // greater than or equal to current time
        },
      };

      const result = await this.db.meeting.getAllData(whereCondition);

      const meetingResult = result.map((item) => ({
        ...item.dataValues,
        image: item.image ? baseurl + item.image : null,
      }));

      return res.status(200).json({ status: 200, message: 'success', data: meetingResult });
    } catch (err) {
      logger.error(`Unable to fetch meetings: ${err}`);
      if (err.name === 'SequelizeValidationError') {
        const validationErrors = err.errors.map((err) => err.message);
        return res.status(500).json({ status: 500, errors: validationErrors });
      }
      return res.status(500).json({ status: 500, message: err.message, data: [] });
    }
  }


  async updateLikeShareCount(req, res) {

    const { id, action } = req;

    const requiredKeys = Object.keys({ id, action });

    if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined)) {
      return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
    }

    let t;

    try {

      const like_count = (action === 'Like') ? 1 : 0;
      const share_count = (action === 'Share') ? 1 : 0;


      const whereCondition = {
        'id': id
      }

      const graphics = await this.db.graphics.findOne({
        where: whereCondition,
      });

      const likeCount = graphics.dataValues.like_count + like_count
      const shareCount = graphics.dataValues.share_count + share_count


      const currentDate = new Date();
      const created_on = currentDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');

      const updatedStatus = await this.db.graphics.UpdateData(
        {

          like_count: likeCount,
          share_count: shareCount,
          modified_on: created_on
        },

        { id: id }

      );

      if (updatedStatus > 0) {
        return res.status(200).json({ status: 200, message: 'Graphics Updated Successful.' });
      } else {
        return res.status(500).json({ status: 500, message: 'Failed to Update data', data: [] });
      }

    } catch (error) {
      logger.error(`Unable to find Feedback: ${error}`);
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map((err) => err.message);
        return res.status(500).json({ status: 500, errors: validationErrors });
      }

      return res.status(500).json({ status: 500, message: error, data: [] });
    }
  }


  async getMeeting(req, res) {
    const decryptedObject = utility.DataDecrypt(req.encReq);
    const { date, user_id } = decryptedObject;

    try {

      let whereCondition;

      //const startDate1=utility.formatDate(new Date(date));
      //const endDate1=utility.formatDate(new Date(date));

      const startDate = new Date();
      startDate.setHours(0, 0, 0);
      //   const endDate =new Date(endDate1);
      //   endDate.setHours(23, 59, 59);

      whereCondition = {
        'meeting_date': {
          [Op.gte]: startDate
        }
      }

      const result = await this.db.meeting.getAllData(whereCondition);

      const meetingResult = [];

      for (const item of result) {

        const user_details = await this.db.meetingDetails.getData(['meeting_id', 'user_id', 'is_enroll', 'is_invite', 'is_join'],
          { user_id: user_id, meeting_id: item.id }

        );

        const get_total_enroll = await this.db.meetingDetails.getUserCount({ meeting_id: item.id, is_enroll: 1 });
        const get_total_invite = await this.db.meetingDetails.getUserCount({ meeting_id: item.id, is_invite: 1 });
        const get_total_join = await this.db.meetingDetails.getUserCount({ meeting_id: item.id, is_join: 1 });

        let is_enroll = 0;
        let is_invite = 0;
        let is_join = 0;

        if (user_details !== null) {
          is_enroll = user_details.is_enroll;
          is_invite = user_details.is_invite;
          is_join = user_details.is_join;
        }

        meetingResult.push({

          ...item.dataValues,
          is_invite,
          is_enroll,
          is_join,
          image: baseurl + item.image,
          total_enroll: get_total_enroll,
          total_invite: get_total_invite,
          total_join: get_total_join,
        });

      }

      return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'success', data: meetingResult })));
      //return res.status(200).json({ status: 200,  message:'success', data : meetingResult });
    }
    catch (err) {
      logger.error(`Unable to find Meeting: ${err}`);
      if (err.name === 'SequelizeValidationError') {
        const validationErrors = err.errors.map((err) => err.message);
        return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, errors: validationErrors })));
        //return res.status(500).json({ status: 500,errors: validationErrors });

      }
      return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, token: '', message: err.message, data: [] })));
      //return res.status(500).json({ status: 500,token:'', message: err.message,data: []  });

    }

  }



  async updateUserwiseMeetingDetails(req, res) {
    const decryptedObject = utility.DataDecrypt(req.encReq);
    const {
      user_id,
      meeting_id,
      is_invite,
      is_enroll,
      is_join

    } = decryptedObject;

    const requiredKeys = Object.keys({
      user_id,
      meeting_id,
      is_invite,
      is_enroll,
      is_join
    });

    if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined)) {
      return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));

    }


    let t;

    try {
      let updatedResult = '';


      const userRow = await this.db.meetingDetails.findOne({
        where: {
          user_id: user_id,
          meeting_id: meeting_id
        }
      });

      const currentDate = new Date();
      const created_on = currentDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');



      if (userRow) {
        const data = {

          is_invite,
          is_enroll,
          is_join,
          modified_on: created_on,
          modified_by: user_id

        };
        updatedResult = await this.db.meetingDetails.UpdateData(data, { user_id: userRow.user_id, meeting_id: userRow.meeting_id });

      } else {
        const data = {
          user_id,
          meeting_id,
          is_invite,
          is_enroll,
          is_join,
          created_by: user_id

        };
        updatedResult = await this.db.meetingDetails.insertData(data);
      }

      if (updatedResult) {
        return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Record Successful.' })));
      } else {
        return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Failed to Update data', data: [] })));
      }

    } catch (error) {
      logger.error(`Unable to find meeting: ${error}`);
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map((err) => err.message);
        return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, errors: validationErrors })));

      }
      return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: error, data: [] })));

    }
  }


  async meetingEnrollReport(req, res) {

    const { from_date, to_date } = req;

    try {

      let whereCondition;

      const startDate = new Date(from_date);
      const endDate = new Date(to_date);
      endDate.setHours(23, 59, 59);

      whereCondition = {
        'enroll_created_on': {
          [Op.between]: [startDate, endDate]
        },
      }

      const result = await this.db.viewMeetingDetails.getAllData(whereCondition);

      const meetingResult = [];

      for (const item of result) {

        meetingResult.push({
          ...item.dataValues,
          image: baseurl + item.image,
        });

      }

      return res.status(200).json({ status: 200, message: 'success', data: meetingResult });

    }
    catch (err) {
      logger.error(`Unable to find Meeting: ${err}`);
      if (err.name === 'SequelizeValidationError') {
        const validationErrors = err.errors.map((err) => err.message);
        return res.status(500).json({ status: 500, errors: validationErrors });
      }
      return res.status(500).json({ status: 500, token: '', message: err, data: [] });
    }

  }


  async updateMeeting(req, res) {
    let t;
    const { meetingId, meeting_name, meeting_link, description, meeting_date, meeting_time } = req.body;
    const meetingIdNum = Number(meetingId); // ensure it's a number

    try {
      t = await this.db.sequelize.transaction();

      const meeting = await this.db.meeting.findOne({ where: { id: meetingIdNum } });
      if (!meeting) {
        await t.rollback();
        return res.status(404).json({ status: 404, message: "Meeting not found" });
      }

      const updatedData = {
        name: meeting_name,
        meeting_link: meeting_link || null,
        description,
        meeting_date,
        meeting_time,
        updated_on: moment().format("YYYY-MM-DD HH:mm:ss"),
      };

      // Use Sequelize's update method instead of updateData
      await this.db.meeting.update(updatedData, {
        where: { id: meetingIdNum },
        transaction: t,
      });

      await t.commit();
      return res.status(200).json({ status: 200, message: "Meeting updated successfully" });
    } catch (error) {
      if (t) await t.rollback();
      console.error(`Error in updateMeeting: ${error}`);
      return res.status(500).json({ status: 500, message: error.message });
    }
  }

  async deleteMeeting(req, res) {
    let t;
    const { meetingId } = req.body;
    // console.log("meetingId", meetingId);

    try {
      t = await this.db.sequelize.transaction();

      const meeting = await this.db.meeting.findOne({ where: { id: meetingId } });
      if (!meeting) {
        await t.rollback();
        return res.status(404).json({ status: 404, message: "Meeting not found" });
      }

      // ✅ Delete the meeting
      await meeting.destroy({ transaction: t });

      await t.commit();
      return res.status(200).json({ status: 200, message: "Meeting deleted successfully" });
    } catch (error) {
      if (t) await t.rollback();
      logger.error(`Error in delete Meeting: ${error}`);
      return res.status(500).json({ status: 500, message: error.message, data: [] });
    }
  }

}




module.exports = new Meeting();