// Define the model
const { Sequelize, Model, DataTypes, Op, sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes, Model) => {

    class wallet_transafer extends Model {
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
          const result = await this.findOne({
            attributes: attribute,
            where: whereClause
          });
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      
      static async getTransferForMonth(user_id, from_date, upto_date) {

        const result = await this.findOne({
            attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'num']],
            where: {
                from_user_id: user_id,
                status: 1,
                created_on: {
                    [Op.between]: [from_date, upto_date]
                }
            },
            order: [['id', 'DESC']]
        });

        return result ? result.dataValues.num: 0;
      }

      static async getTotalSendMoney(whereClause){
        const totalsend = await this.findOne({
          attributes: [[sequelize.fn('sum', sequelize.col('amount')), 'num']],
          where: {
            ...whereClause
        },
        });
        return totalsend?.dataValues.num || 0;
      }

    }

    wallet_transafer.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        from_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        to_user_id: {
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
        message: {
            type: DataTypes.STRING,
            allowNull: false
        },
        env: {
            type: DataTypes.STRING,
            allowNull: false
        },
        from_transaction_id: {
            type: DataTypes.BIGINT,
            allowNull: true
        },
        to_transaction_id: {
            type: DataTypes.BIGINT,
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
        updated_on: {
            type: DataTypes.DATE,
            allowNull: true
        },
        updated_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        deleted_on: {
            type: DataTypes.DATE,
            allowNull: true
        },
        deleted_by: {
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
        modelName: 'wallet_transafer',
        tableName: 'tbl_wallet_transfer', // specify table name here
        timestamps: false
    });
      
    return wallet_transafer;
}


