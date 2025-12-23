module.exports = (sequelize, DataTypes, Model) => {

    class logUserService extends Model {

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

    logUserService.init({
        id: {
          type: DataTypes.BIGINT,
          allowNull: false,
		  primaryKey: true,
		  autoIncrement: true
        },
	    user_id: {
          type: DataTypes.BIGINT,
          allowNull: false
        },
        created_on: {
          type: DataTypes.DATE,
          allowNull: true
        },
	    service_type: {
          type: DataTypes.STRING,
          allowNull: true
        },
  
      }, {
        sequelize, 
        modelName: 'logUserService',
        tableName: 'log_user_service', // specify table name here
        timestamps: false
      });
      
      return logUserService;
}