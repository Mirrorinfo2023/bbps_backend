const { Sequelize, Model, DataTypes, Op, sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes, Model) => {

    class log extends Model {
        
        
        static async getUserLoginCount(log_date,username) {
        try {
          const result = await this.count({
            where: {status:200,log_date,original_url:'/api/users/login',
             [Op.and]: Sequelize.literal(`JSON_UNQUOTE(JSON_EXTRACT(request_body, '$.username')) = '${username}'`)
            
                
            }
          });
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      
      
      
      
      
      
    }

    log.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		  primaryKey: true,
		  autoIncrement: true
        },
	   method: {
          type: DataTypes.STRING,
          allowNull: true
      },
      original_url: {
          type: DataTypes.STRING,
          allowNull: true
      },
	  status: {
          type: DataTypes.INTEGER,
          allowNull: true
      },
	  success: {
          type: DataTypes.STRING,
          allowNull: true
      },
	   response_message: {
          type: DataTypes.STRING,
          allowNull: true
      },response_header: {
            type: DataTypes.STRING,
            allowNull: true
        },
        response_body: {
            type: DataTypes.STRING,
            allowNull: true
        },
        request_body: {
            type: DataTypes.STRING,
            allowNull: true
        },request_header: {
            type: DataTypes.STRING,
            allowNull: true
        },
        log_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        client_ip: {
            type: DataTypes.STRING,
            allowNull: true
        },
       
      
      
      
	
	
	
  
      }, {
        sequelize, 
        modelName: 'log_api_service',
        tableName: 'log_api_service', // specify table name here
        timestamps: false
      });
      
      return log;
}