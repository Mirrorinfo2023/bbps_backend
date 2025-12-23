const { Sequelize, Model, DataTypes, Op, sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes, Model) => {

    class ViewSms extends Model {
        

           static async getOtpReport(fromDate, toDate) {
            try {
              const result = await this.findAll({
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

    ViewSms.init({
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
           created_on: {
              type: DataTypes.DATE,
              allowNull: true
          },
          otp_date: {
              type: DataTypes.STRING,
              allowNull: true
          },
          first_name: {
            type: DataTypes.STRING,
            allowNull: false
          },
          last_name: {
            type: DataTypes.STRING,
            allowNull: false
          },
          mlm_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique:true
          }
        
  
      },
      {
        sequelize, 
        modelName: 'ViewSms',
        tableName: 'view_otp', // specify table name here
        timestamps: false
      });
      
      return ViewSms;
}


