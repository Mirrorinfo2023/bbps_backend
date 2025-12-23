const { Sequelize, Model, DataTypes, Op, sequelize,literal } = require('sequelize');
module.exports = (sequelize, DataTypes, Model) => {

    class userTask extends Model {

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
          
    static async getTodayTask(user_id) {
        try {
                const currentDate = new Date();
                const year = currentDate.getFullYear();
                const month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
                const day = String(currentDate.getDate()).padStart(2, '0');
                const todayDate = `${year}-${month}-${day}`;
                const result = await this.findAll({
                    attributes: [ 'task_id',[sequelize.fn('COUNT', sequelize.col('user_id')), 'count']],
                    where: {user_id,
                        task_date: sequelize.literal(`CAST(task_date AS DATE) = '${todayDate}'`)
                    },
                    group: [ 'task_id']
                  });
             
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      
      
    }

    userTask.init({
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
        task_id: {
        type: DataTypes.INTEGER,
        allowNull: true
       },
     
      request_type: {
        type: DataTypes.STRING,
        allowNull: true
      },
       task_date: {
        type: DataTypes.DATE,
        allowNull: true
       },
       status: {
        type: DataTypes.INTEGER,
        allowNull: true
       },
      
  
      }, {
        sequelize, 
        modelName: 'userTask',
        tableName: 'log_user_task', // specify table name here
        timestamps: false
      });
      
      return userTask;
}