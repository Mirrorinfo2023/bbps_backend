// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

    class add_money extends Model {
      static async insertData(data) {
        try {
          const result = await this.create(data);
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }

      static async getCount(trans_no) {
        try {
          const result = await this.count({
            where: {trans_no}
          });
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      
      
      static async getAddMoneyById(id) {
        try {
        
          const result = await this.findOne( {
            where: { id: id }
          });
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }

      
      static async UpdateData(data,id) {
        try {
          // console.log(data);
          const result = await this.update(data, {
            where: { id: id }
          });
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      
      static async getManualAddMoney(whereClause){
        const totaladd = await this.findOne({
          attributes: [[sequelize.fn('sum', sequelize.col('amount')), 'num']],
          where: {
            ...whereClause
        },
        });
       return totaladd?.dataValues.num || 0;
      }


    }

    add_money.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		  primaryKey: true,
		  autoIncrement: true
        },
        user_id: {
              type: DataTypes.INTEGER,
              allowNull: false
              },
        amount: {
              type: DataTypes.INTEGER,
              allowNull: false
          },
        status: {
              type: DataTypes.INTEGER,
              allowNull: true
          },
        category: {
              type: DataTypes.STRING,
              allowNull: false
          },
        trans_no: {
              type: DataTypes.STRING,
              allowNull: false
          },
        img: {
          type: DataTypes.STRING,
          allowNull: false
          },
        amr_aw: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        rejection_reason: {
          type: DataTypes.STRING,
          allowNull: true
        },
        created_on: {
          type: DataTypes.DATE,
          allowNull: true
        },
        updated_on: {
          type: DataTypes.DATE,
          allowNull: true
        },
        updated_by: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
          
        wallet: {
          type: DataTypes.STRING,
          allowNull: true
        }
          
          
          
          
        
  
      },
      {
        sequelize, 
        modelName: 'add_money',
        tableName: 'trans_add_money_request', // specify table name here
        timestamps: false
      });
      
      return add_money;
}


