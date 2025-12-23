const { Sequelize, Model, DataTypes, Utils } = require("sequelize");
const logger = require('../logger/api.logger');
var config = require('./config.json');
const connectpartner = () => {

    const hostName = config.host;
    const userName = config.partner_username;
    const password = config.partner_password;
    const database = config.partner_database;
    const dialect = config.dialect;

    const sequelize = new Sequelize(database, userName, password, {
        host: hostName,
        dialect: dialect,
        timezone: '+05:30',
        operatorsAliases: {
			$gt: Sequelize.Op.gt,
			$lt: Sequelize.Op.lt,
			$eq: Sequelize.Op.eq,
			$ne: Sequelize.Op.ne,
			// ... and so on
		  },
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 5000
        }
    });
    
sequelize
  .authenticate()
  .then(() => {
    console.log('partners Connection to the database has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect partners to the database:', err);
  });

    const partnerdb = {};
	partnerdb.sequelize = sequelize;
	partnerdb.Sequelize = Sequelize;

	  //Model
	  partnerdb.wallet = require("../model/partners/partners_wallet.model")(sequelize, DataTypes, Model);
    partnerdb.partner = require("../model/partners/partner.model")(sequelize, DataTypes, Model);
    partnerdb.transOrder = require("../model/partners/trans_order.model")(sequelize, DataTypes, Model);
    partnerdb.gatewayReqRes = require("../model/partners/gateway_request_response.model")(sequelize, DataTypes, Model);
    partnerdb.viewTransactions = require("../model/partners/view_user_transactions.model")(sequelize, DataTypes, Model);
    
    partnerdb.bbpsBillFetch = require("../model/partners/bbps_service_bill_fetch.model")(sequelize, DataTypes, Model);
    partnerdb.bbpsBillPayment = require("../model/partners/bbps_service_bill_payment.model")(sequelize, DataTypes, Model);
	
  return partnerdb;

}


module.exports = {
    connectpartner
    
}