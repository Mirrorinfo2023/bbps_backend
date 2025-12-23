const { Sequelize, Model, DataTypes, Op, sequelize,fn, col, literal } = require('sequelize');
module.exports = (sequelize, DataTypes, Model) => {

    class PlanPurchase extends Model {
        
  static async updateData(data,id) {
        
        try {
            
           const result = await this.update(data, {
               
            where: { id:id}
            
          });
          
          return result;
          
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
        
        
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

      static async getData(attribute, whereClause) {
        try {
        
          const result = await this.findOne({
            attributes: [...attribute],
            where: { ...whereClause}
          });
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }

      
      
     static async getNonPrimeCount(user_id) {
        try {
          const result = await this.count({
                where: {
                  user_id: user_id,
                  status: 1,
                  plan_id: {
                    [Op.eq]: 1,
                    [Op.notIn]: [2, 3, 4] // Exclude other plan_id values
                  }
                }
              });
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      static async getPrimeCount(user_id) {
        try {
          const result = await this.count({
                where: {
                  user_id: user_id,
                  status: 1
                }
              });
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      
       static async PlanChkCount(user_id) {
        try {
          const result = await this.count({
                where: {
                  user_id: user_id,
                  status: 1
                }
              });
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
    
    static async getAllPlanUser(user_id) {
        try {
          const result = await this.findAll({
            attributes: ['id'],
            where: {user_id,status:1},
            raw: true,
          });
       
          const dataArrays = result.map(row => row.id);

            return dataArrays;
        
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }


  static async getAllInvestment(user_id) {
        try {
          const result = await this.findAll({
      
            where: {user_id,status:1},
            raw: true,
          });
       
        
            return result;
        
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }



    static async getSinglePlanUserId(user_id) {
      try {
        const result = await this.findOne({
          attributes: ['id'],
          where: { user_id, status: 1 },
          raw: true,
        });

        return result ? result.id : null;

      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
    }

	static async getTotalInvestment(user_id) {
      try {
       		const result = await this.findOne({
            attributes: [
              [sequelize.fn('SUM', sequelize.col('amount')), 'amount']
            ],
            where: {
              user_id,
              status: '1'
            },
            raw: true
          });

   		 return result?.amount || 0;


      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
    }



	 static async getPlanDate(user_id,id) {
        try {
          const result = await this.findOne({
            attributes: ['id',  [fn('DATE_FORMAT', col('created_on'), '%Y-%m-%d'), 'planDate'] ],
            where: {user_id,id:id},
            raw: true,
          });
       
          return result;
        
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      
        static async getPrimeCountwithCondition(plan_id) {
        try {
          const result = await this.count({
                where: {
                  status: 1,
                  plan_id: {
                    [Op.eq]: plan_id,
                   
                  }
                }
              });
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }

   

    }

    PlanPurchase.init({
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
        transaction_id:{
            type: DataTypes.BIGINT,
            allowNull: false
        },
         plan_id:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        amount:{
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        status:{
            type: DataTypes.INTEGER,
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
        order_status:{
          type: DataTypes.INTEGER,
          allowNull: true
        },
        order_remarks:{
          type: DataTypes.TEXT,
          allowNull: true
        }
        
  
      },
      {
        sequelize, 
        modelName: 'PlanPurchase',
        tableName: 'tbl_plan_purchase', // specify table name here
        timestamps: false,
        indexes: [
          {
            unique: true,
            fields: ['user_id', 'plan_id'],
          },
        ],
        
      });
      
      return PlanPurchase;
}


