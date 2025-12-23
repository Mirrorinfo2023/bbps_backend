// Define the Countries model
module.exports = (sequelize, DataTypes, Model,Op) => {

    class primeProduct extends Model {
        
       
    
     static async getAllData(whereCondition) {
        try {
          const result = await this.findAll({
              where: whereCondition,
              order: [['created_on', 'DESC']],
            });
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }


    }


    primeProduct.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
                primaryKey: true,
                autoIncrement: true
          },
          entry_date:{
              type: DataTypes.STRING,
              allowNull: false
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
                allowNull: false
            },
            mobile: {
                type: DataTypes.STRING,
                allowNull: true
            },
            user_id: {
                type: DataTypes.BIGINT,
                allowNull: false
            },
            plan_id: {
                type: DataTypes.BIGINT,
                allowNull: true
            },
            amount: {
                type: DataTypes.DOUBLE,
                allowNull: false
            },
            transaction_id: {
                type: DataTypes.STRING,
                allowNull: true
            },
            circle: {
                type: DataTypes.STRING,
                allowNull: true
            },
            district: {
                type: DataTypes.STRING,
                allowNull: true
            },

            block: {
                type: DataTypes.STRING,
                allowNull: true
            },

            address: {
                type: DataTypes.TEXT,
                allowNull: true
            },

            created_on: {
                type: DataTypes.DATE,
                allowNull: true
            },
            created_by: {
                type: DataTypes.BIGINT,
                allowNull: true
            },
            status: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            plan_name: {
                type: DataTypes.STRING,
                allowNull: true
            },
            plan_amount: {
                type: DataTypes.DOUBLE,
                allowNull: true
            },
            plan_details: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            prime_rate: {
                type: DataTypes.DOUBLE,
                allowNull: true
            },
            prime_amount: {
                type: DataTypes.DOUBLE,
                allowNull: true
            },
            order_status: {
                type: DataTypes.INTEGER,
                allowNull: true
            },

            order_remarks: {
                type: DataTypes.TEXT,
                allowNull: true
            },


         
         
     }, {
        sequelize, 
        modelName: 'primeProduct',
        tableName: 'view_prime_product', // specify table name here
        timestamps: false
      });
      
      return primeProduct;
}


