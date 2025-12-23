// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

    class userLog extends Model {
  
        static async getCategory() {
            const feedbackCategory = await this.findAll({
            order: [['id', 'DESC']],
            });
            return feedbackCategory;
        }

        static async insertData(data) {
            try {
            const result = await this.create(data);
                return result;
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
        }

  
  
    }
  
    
  
      
  
    userLog.init({
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
        action_details : {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        created_on: {
              type: DataTypes.DATE,
              allowNull: true
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
         logtype:{
            type: DataTypes.STRING,
            allowNull: false
        }
        
        
        
  
      },
      {
        sequelize, 
        modelName: 'user_logs',
        tableName: 'log_user_details', // specify table name here
        timestamps: false
      });
      
      return userLog;
  }
  
  
  