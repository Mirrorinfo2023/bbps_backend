module.exports = (sequelize, DataTypes, Model) => {

    class userAdds extends Model {

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

          static async getDataCount(attribute, whereClause) {
            try {
              const fixedCondition = { status: 1 };
              const result = await this.count({
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
    }

    userAdds.init({
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
      add_page: {
          type: DataTypes.STRING,
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
      
  
      }, {
        sequelize, 
        modelName: 'userAdds',
        tableName: 'log_user_adds', // specify table name here
        timestamps: false
      });
      
      return userAdds;
}