module.exports = (sequelize, DataTypes, Model) => {

    class CycleIncome extends Model {
        
        
    static async insertData(data) {
        try {
          const result = await this.create(data);
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }

    static async getCount(user_id,plan_id) {
        try {
          const result = await this.count({
            where: {user_id,plan_id}
          });
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
    
    }

    CycleIncome.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		      primaryKey: true,
		      autoIncrement: true
        },
        user_id:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
         plan_id:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        cycle_date: {
          type: DataTypes.DATE,
          allowNull: true
          },
        cycle_type: {
          type: DataTypes.TEXT,
          allowNull: true
          }
        
  
      },
      {
        sequelize, 
        modelName: 'CycleIncome',
        tableName: 'trans_cycle_income', // specify table name here
        timestamps: false
       
        
      });
      
      return CycleIncome;
}


