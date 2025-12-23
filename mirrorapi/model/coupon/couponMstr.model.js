// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

    class couponMstr extends Model {
        static async getCouponMstr(code)
        {
            const coupon = await this.findOne({
            where:{
                coupon_code:code,
                status:'1'
            },
            order: [['id', 'DESC']]
            });

            return coupon;
        }
    }

    couponMstr.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		  primaryKey: true,
		  autoIncrement: true
        },
        coupon_name:{
            type: DataTypes.STRING,
            allowNull: false
        },
        coupon_code: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
          type: DataTypes.INTEGER,
          allowNull: false
          },
        created_on: {
          type: DataTypes.DATE,
          allowNull: true
          },
      },
      {
        sequelize, 
        modelName: 'couponMstr',
        tableName: 'mst_coupon', // specify table name here
        timestamps: false
      });
      
      return couponMstr;
}


