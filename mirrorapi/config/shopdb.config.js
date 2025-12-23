const { Sequelize, Model, DataTypes, Utils } = require("sequelize");
const logger = require('../logger/api.logger');
var config = require('./config.json');
const connectshop = () => {

    const hostName = config.host;
    const userName = config.shop_username;
    const password = config.shop_password;
    const database = config.shop_database;
    const dialect = config.dialect;

    const sequelize = new Sequelize(database, userName, password, {
		logging: console.log,
        host: hostName,
        dialect: dialect,
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
    console.log('shop Connection to the database has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect hub to the database:', err);
  });

    const shopdb = {};
	shopdb.sequelize = sequelize;
	shopdb.Sequelize = Sequelize;	
	//Model
	shopdb.order = require("../model/user/shop_order.model")(sequelize, DataTypes, Model);
	shopdb.gateway = require("../model/add_money/payment_gateway.model")(sequelize, DataTypes, Model);
	
  return shopdb;

}


module.exports = {
    connectshop
    
}