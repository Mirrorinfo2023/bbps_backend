const { Sequelize, Model, DataTypes, Op, sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes, Model) => {

    class sms extends Model {
        
         static async getOtpData(otp,mode,type,category,mobile) {
            try {
              const result = await this.findAll({
                //   attributes: ['code'],
                  where: {
                    otp,
                    mode,
                    type,
                    category,
                    mobile,
                    status: 1,
                  },
                  order: [['id', 'DESC']], 
                  limit: 1, // Limit the result to one row
                });
               
                return result;
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
          }


           static async getOtpReport(fromDate, toDate) {
            try {
              const result = await this.findAll({

                attributes: [
                  'mode',
                  'type',
                  'category',
                  'mobile',
                  'otp',
                  'status',
                  [Sequelize.fn('date_format', Sequelize.col('created_on'), ' %d-%m-%Y %H:%i:%s'), 'otp_date'],
                 
                ],
                  where: {
                  created_on: {
                    [Op.between]: [fromDate, toDate]
                  }
                  },
                  order: [['created_on', 'DESC']]
                });
                return result;
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
          }
        
        
        
        
    }

        sms.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		  primaryKey: true,
		  autoIncrement: true
        },
         mode: {
          type: DataTypes.STRING,
          allowNull: false
          },
           type: {
              type: DataTypes.STRING,
              allowNull: false
          },
           category: {
              type: DataTypes.STRING,
              allowNull: false
          },
           mobile: {
              type: DataTypes.INTEGER,
              allowNull: false
          },
           otp: {
              type: DataTypes.INTEGER,
              allowNull: false
          },
          status: {
          type: DataTypes.INTEGER,
          allowNull: false
          },
           sms_response: {
          type: DataTypes.STRING,
          allowNull: true,
          //defaultValue: 'null', 
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
          }
        
  
      },
      {
        sequelize, 
        modelName: 'sms',
        tableName: 'tbl_otp', // specify table name here
        timestamps: false
      });
      
      return sms;
}


