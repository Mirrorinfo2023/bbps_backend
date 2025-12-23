const { Sequelize, Model, DataTypes, Op, sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes, Model) => {

    class userAction extends Model {

        static async insertData(data) {
            try {
              const result = await this.create(data);
                return result;
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
          }
    
          static async getData(attribute, whereClause) {
            try {
              const fixedCondition = { status: 1 };
              const result = await this.findOne({
                attributes: [...attribute],
                where: { ...fixedCondition, ...whereClause },
                order: [['created_on', 'DESC']]
              });
          
              return result;
            } catch (error) {
              console.error('Error:', error);
              throw error;
            }
          }
          
    static async getLastUserLog(user_id,today)
      {
           try {
                const Log = await this.findOne({
                   
                    where: Sequelize.literal(`CAST(created_on AS DATE) = '${today}' AND user_id = '${user_id}' and status=1`),
                    order: [['id', 'DESC']],
                    raw: true,
                    nest: true
                });
                return Log;
            } catch (error) {
                console.error('Error in user action Log:', error);
                throw error; 
            }
      }
      
      
    }

    userAction.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		  primaryKey: true,
		  autoIncrement: true
        },
	   user_id: {
          type: DataTypes.BIGINT,
          allowNull: false
      },
      refer_link_count: {
          type: DataTypes.INTEGER,
          allowNull: false
      },
	  follow_up_count: {
          type: DataTypes.INTEGER,
          allowNull: false
      },
	  grafix_count: {
          type: DataTypes.INTEGER,
          allowNull: false
      },
      income_screenshot_count: {
          type: DataTypes.INTEGER,
          allowNull: false
      },
      direct_count: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      prime_level_count: {
        type: DataTypes.INTEGER,
        allowNull: true
       },
       login_attampt: {
        type: DataTypes.INTEGER,
        allowNull: true
       },
       created_on: {
        type: DataTypes.DATE,
        allowNull: true
       },
       status: {
        type: DataTypes.INTEGER,
        allowNull: true
       },
      
  
      }, {
        sequelize, 
        modelName: 'userAction',
        tableName: 'log_user_action', // specify table name here
        timestamps: false
      });
      
      return userAction;
}