// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

    class cashbackPlan extends Model {

      static async getData(plan_id) {
        try {
          const result = this.findOne({where: {id: plan_id} });
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      
      static async getAllPlan(whereClause=null) {
        let whereParam = '';
        if(whereClause!=null)
        {
            whereParam = whereClause;
        }
        
        try {
          const result = await this.findAll({
              where: {
                status: 1,
                ...whereParam
              },
              order: [['plan_amount', 'ASC']],
              attributes: ['id', 'plan_name', 'plan_amount','gst','without_gst','plan_details', 'is_product'],
            });
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      
    //   static async getUserPlan(user_id) {
    //     try {
    //       const result = this.findOne({where: {user_id: user_id,
    //           plan_amount: {
    //               [Sequelize.Op.eq]: Sequelize.literal('(SELECT MAX(plan_amount) FROM your_table_name WHERE user_id = ' + user_id + ')')
    //             }
    //       } });
    //         return result;
    //     } catch (error) {
    //         console.error('Error:', error);
    //         throw error;
    //     }
    //   }
      
      
      
    }

    cashbackPlan.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		  primaryKey: true,
		  autoIncrement: true
        },
        plan_name:{
            type: DataTypes.STRING,
            allowNull: false
        },
         plan_amount: {
              type: DataTypes.DECIMAL,
              allowNull: false
        },
         plan_details: {
              type: DataTypes.STRING,
              allowNull: false
        },
         without_gst: {
              type: DataTypes.DECIMAL,
              allowNull: false
        }, gst: {
              type: DataTypes.STRING,
              allowNull: false
        },
         prime_amount: {
              type: DataTypes.DECIMAL,
              allowNull: true
        },
        prime_rate: {
              type: DataTypes.DECIMAL,
              allowNull: false
        },
        created_on: {
          type: DataTypes.DATE,
          allowNull: true
          },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        modified_on: {
          type: DataTypes.DATE,
          allowNull: true
          },
        modified_by: {
          type: DataTypes.INTEGER,
          allowNull: true
          },
        deleted_on: {
          type: DataTypes.STRING,
          allowNull: false
        },
        deleted_by: {
          type: DataTypes.STRING,
          allowNull: true
        }, 
        status: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        bill_rate: {
          type: DataTypes.DECIMAL,
          allowNull: true
        },
        is_product: {
          type: DataTypes.INTEGER,
          allowNull: true
        }
  
      },
      {
        sequelize, 
        modelName: 'cashbackPlan',
        tableName: 'mst_recharge_cashback_plan', // specify table name here
        timestamps: false
      });
      
      return cashbackPlan;
}


