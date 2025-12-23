
module.exports = (sequelize, DataTypes, Model) => {

    class leadsUserAction extends Model {

      static async getData() {
            const result = await this.findAll({
            where: {status:1},
            order: [['id', 'DESC']],
            });
            return result;
      }

      static async getDataById(lead_id) {
        const result = await this.findOne({
          where: {id:lead_id},
          order: [['id', 'DESC']],
          });
          return result;
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

      static async getDataWithClause(whereClause) {
        try {
          const result = await this.findAll({
            where: {status:1, category_id:whereClause},
            order: [['created_on', 'ASC']],
          });
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }

      
      
      static async UpdateData(data , whereClause) {
        try {
     
          const result = await this.update(data, {
            where: whereClause
          });
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }

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
      
      static async getUserCount(user_id) {
        const result = await this.count({
          where: {user_id:user_id, status:2}, //for accept only
          });
          return result;
      }
      
      
      static async getTotalDistribution(user_id) {
        const amount = await this.findOne({
          attributes: [
            [sequelize.fn('SUM', sequelize.col('distributed_amount')), 'amount']
          ],
          where: {
            user_id: user_id,
            status: 2,
          }
        });

        let Damount=0;
        
        if(amount && amount.dataValues.amount !== null && amount.dataValues.amount>=0){
            
          Damount = amount.dataValues.amount;
        }

        return Damount;
      }
      
      static async getAllCount(whereClause) {
        const result = await this.count({
          where: {status:2, ...whereClause},
          });
          return result;
      }
      

    }

    leadsUserAction.init({
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
        category_id:{
          type: DataTypes.INTEGER,
          allowNull: false
        },
        lead_id : {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        action : {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: true
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
        distributed_amount: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
          remarks: {
            type: DataTypes.TEXT,
            allowNull: true
        }
      },
      {
        sequelize, 
        modelName: 'leadsUserAction',
        tableName: 'tbl_leads_user_action', // specify table name here
        timestamps: false
      });
      
      return leadsUserAction;
}


