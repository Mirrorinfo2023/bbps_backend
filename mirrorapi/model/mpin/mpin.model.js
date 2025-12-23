// Define the Countries model
const { Sequelize, Model, DataTypes, Op, sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes, Model) => {

    class mpin extends Model {

        static async insertData(data) {
            try {
              const result = await this.create(data);
                return result;
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
          }
          
        static async getWrongMpinCount(whereCondition){
            const mpinCount = await this.findOne({
              attributes: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'num']],
              where:whereCondition

            });
            return mpinCount.dataValues.num;
          }


          static async UpdateData(data , whereClause) {
            try {
            // console.log(data);
            const result = await this.update(data, {
                where: whereClause
            });
                return result;
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
        }


          


    }

    mpin.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		  primaryKey: true,
		  autoIncrement: true
        },
         
        user_id: {
              type: DataTypes.INTEGER,
              allowNull: false
          },
           mpin: {
              type: DataTypes.INTEGER,
              allowNull: false
          },
          status: {
                type: DataTypes.INTEGER,
                allowNull: false
          },
         
           created_on: {
              type: DataTypes.DATE,
              allowNull: true
          },
             modified_on: {
              type: DataTypes.DATE,
              allowNull: true
          },
           deleted_on: {
              type: DataTypes.DATE,
              allowNull: true
          },
           action: {
            type: DataTypes.STRING,
            allowNull: true
        },
          app_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
  
      },
      {
        sequelize, 
        modelName: 'mpin',
        tableName: 'log_user_mpin_details', // specify table name here
        timestamps: false
      });
      
      return mpin;
}


