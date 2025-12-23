// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

    class spinner extends Model {
        static async insert(data){
            try {
                const result = await this.create(data);
                  return result;
              } catch (error) {
                  console.error('Error:', error);
                  throw error;
              }
        }
    }

    spinner.init({
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
        spinner_id: {
              type: DataTypes.STRING,
              allowNull: false
        },
        spinner_type: {
              type: DataTypes.STRING,
              allowNull: false
        },
        generate_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        expire_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        remaining_days: {
              type: DataTypes.INTEGER,
              allowNull: false
        },
        is_used: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        random_number: {
          type: DataTypes.INTEGER,
          allowNull: false
          },
        status: {
          type: DataTypes.INTEGER,
          allowNull: true
          },
        used_date:{
            type: DataTypes.DATE,
            allowNull: true
        },
        created_on: {
          type: DataTypes.DATE,
          allowNull: true
          },
        applied_for: {
          type: DataTypes.STRING,
          allowNull: true
          },
        order_id: {
          type: DataTypes.STRING,
          allowNull: true
          },
        redeem_amount: {
          type: DataTypes.DECIMAL,
          allowNull: false
        },
        attempt: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        main_amount: {
            type: DataTypes.DECIMAL,
          allowNull: false
        }
  
      },
      {
        sequelize, 
        modelName: 'spinner',
        tableName: 'tbl_spinner', // specify table name here
        timestamps: false
      });
      
      return spinner;
}


