module.exports = (sequelize, DataTypes, Model) => {

    class UserDataNotification extends Model {

        static async insertData(data) {
            try {
              const result = await this.create(data);
                return result;
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
          }
    
          static async getData(whereClause) {
            try {
              const fixedCondition = { status: 1 };
              const result = await this.findOne({
                where: { ...fixedCondition, ...whereClause },
                order: [['created_on', 'DESC']]
              });
          
              return result;
            } catch (error) {
              console.error('Error:', error);
              throw error;
            }
          }
    }

    UserDataNotification.init({
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
        is_gender: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        is_profile: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        is_interest: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        created_on: {
            type: DataTypes.DATE,
            allowNull: true
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        entry_date: {
            type: DataTypes.DATE,
            allowNull: false
        }
      
  
      }, {
        sequelize, 
        modelName: 'UserDataNotification',
        tableName: 'log_user_data_notification', // specify table name here
        timestamps: false
      });
      
      return UserDataNotification;
}