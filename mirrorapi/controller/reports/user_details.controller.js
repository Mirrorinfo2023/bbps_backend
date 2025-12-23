const { connect, config } = require('../../config/db.config');
//const logger = require('../../logger/api.logger');
const { QueryTypes, Sequelize, Model, DataTypes, Op } = require('sequelize');
//const helper = require('../utility/helper'); 
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);
const axios = require('axios');

class UserDetails {
  db = {};

  constructor() {
    this.db = connect();
  }

  async details(req, res) {
    const { from_date, to_date, filter, searchTerm, page } = req;

    try {
      const pagecount = (page) ? page : 1;


      let whereClause = '';

      if (filter != null && filter != '') {
        whereClause = {
          [filter]: {
            [Op.like]: `%${searchTerm}%`
          }
        }

      } else {
        const fromDate = new Date(from_date);
        const toDate = new Date(to_date);
        fromDate.setHours(0, 0, 0);
        toDate.setHours(23, 59, 59);

        whereClause = {
          created_on: {
            [Op.between]: [fromDate, toDate]
          }
        }
        // console.log("whereClause is:", whereClause);

      }

      const report = {
        totalUsers: await this.db.userDetails.count({ where: whereClause }),
        totalActiveusers: await this.db.userDetails.count({ where: { ...whereClause, status: `1` } }),
        totalInactiveusers: await this.db.userDetails.count({ where: { ...whereClause, status: `0` } }),
        totalPrimeusers: await this.db.userDetails.count({ where: { ...whereClause, is_prime: `1` } }),
        totalNonprimeusers: await this.db.userDetails.count({ where: { ...whereClause, is_prime: `0` } }),
      }
      const results = await this.db.userDetails.findAll({
        where: { ...whereClause },
        order: [['created_on', 'DESC']],
        limit: 500
      });
      if (results !== null) {
        return { status: 200, message: 'Successfully all record found', data: results, totalPageCount: 0, report };
      }

      return { status: 400, message: 'Record not found', data: [] };

    } catch (error) {
      logger.error(`Unable to find user: ${error}`);
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map((err) => err.message);
        return { status: 500, errors: validationErrors };
      }

      return { status: 500, message: error.message, data: [] };
    }
  }
}

module.exports = new UserDetails();