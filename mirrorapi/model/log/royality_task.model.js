const { Sequelize, Model, DataTypes, Op, sequelize,literal } = require('sequelize');
module.exports = (sequelize, DataTypes, Model) => {

    class royality_task extends Model {

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

    royality_task.init({
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
        description: {
        type: DataTypes.STRING,
        allowNull: true
       },
     
      image: {
        type: DataTypes.STRING,
        allowNull: true
      },
       task_type: {
        type: DataTypes.STRING,
        allowNull: true
      },
     title: {
        type: DataTypes.STRING,
        allowNull: true
      },
       task_date: {
        type: DataTypes.DATE,
        allowNull: true
       },
         meeting_date: {
        type: DataTypes.DATE,
        allowNull: true
       },
       status: {
        type: DataTypes.INTEGER,
        allowNull: true
       },
        remarks: {
        type: DataTypes.STRING,
        allowNull: true
      },
      
      
    
                  
  
      }, {
        sequelize, 
        modelName: 'royality_task',
        tableName: 'log_royality_task', // specify table name here
        timestamps: false
      });
      
      return royality_task;
}