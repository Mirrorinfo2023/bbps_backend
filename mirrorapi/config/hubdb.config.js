const { Sequelize, Model, DataTypes, Utils } = require("sequelize");
const logger = require('../logger/api.logger');
var config = require('./config.json');
const connecthub = () => {

    const hostName = config.host;
    const userName = config.hub_username;
    const password = config.hub_password;
    const database = config.hub_database;
    const dialect = config.dialect;

    const sequelize = new Sequelize(database, userName, password, {
		//logging: console.log,
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
    console.log('hub Connection to the database has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect hub to the database:', err);
  });

    const hubdb = {};
	hubdb.sequelize = sequelize;
	hubdb.Sequelize = Sequelize;	
	//Model
	hubdb.Transaction = require("../model/add_money/Transaction.model")(sequelize, DataTypes, Model);
	
  return hubdb;

}


module.exports = {
    connecthub
    
}