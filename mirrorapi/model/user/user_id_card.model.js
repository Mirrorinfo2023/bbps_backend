// Define the  model
module.exports = (sequelize, DataTypes, Model,Op) => {

    class userIdCard extends Model {

      static async getData(attribute, whereClause) {
        try {
          const fixedCondition = {status: 1};
          const result = await this.findOne({
            attributes: [...attribute],
            where: {...fixedCondition, ...whereClause}
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
       

      static async updateData(data,whereClause) {
        try {
          // console.log(data);
          const result = await this.update(data, {
            where: whereClause
          });
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }


      
    }

    userIdCard.init({
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        shipping_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address_type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        shipping_city: {
            type: DataTypes.STRING,
            allowNull: false
        },
        shipping_state: {
            type: DataTypes.STRING,
            allowNull: false
        },
        shipping_pincode: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        shipping_mobile_no: {
            type: DataTypes.STRING,
            allowNull: false
        },
        shipping_address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        transaction_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        order_id: {
            type: DataTypes.STRING,
            allowNull: true
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
            type: DataTypes.BIGINT,
            allowNull: true
        },
        modified_on: {
            type: DataTypes.DATE,
            allowNull: true
        },
        modified_by: {
            type: DataTypes.BIGINT,
            allowNull: true
        },
        rejection_reason: {
            type: DataTypes.TEXT,
            allowNull: true
        }
         
     }, {
        sequelize, 
        modelName: 'userIdCard',
        tableName: 'tbl_user_id_card_details', // specify table name here
        timestamps: false
      });
      
      return userIdCard;
}


