// Define the Countries model
const { Sequelize, Model, DataTypes, Op, sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes, Model) => {

    class coupon extends Model {
        static async insert(data){
            try {
                const result = await this.create(data);
                  return result;
              } catch (error) {
                  console.error('Error:', error);
                  throw error;
              }
        }
        
        static async getCouponCount(user_id) {
          const getCount = await this.findOne({
            attributes: [
              [sequelize.fn('COUNT', sequelize.col('id')), 'voucher']
            ],
            where: {
              user_id: user_id,
              coupon_used: 0,
              coupon_expire_date: {
                [Sequelize.Op.gte]: new Date()
               }
            }
          });

          return getCount?getCount.dataValues.voucher:0;
        }
    }

    coupon.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		  primaryKey: true,
		  autoIncrement: true
        },
        coupon_id:{
            type: DataTypes.BIGINT,
            allowNull: true
        },
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        coupon_code: {
              type: DataTypes.STRING,
              allowNull: false
        },
        coupon_type: {
              type: DataTypes.STRING,
              allowNull: false
        },
        coupon_send_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        coupon_expire_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        remaining_days: {
              type: DataTypes.INTEGER,
              allowNull: false
        },
        coupon_used: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        isScratch: {
          type: DataTypes.INTEGER,
          allowNull: false
          },
        status: {
          type: DataTypes.INTEGER,
          allowNull: true,
          default: 1
          },
        coupon_used_date:{
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
  
      },
      {
        sequelize, 
        modelName: 'coupon',
        tableName: 'tbl_coupon', // specify table name here
        timestamps: false
      });
      
      return coupon;
}


