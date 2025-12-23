// Define the Countries model
module.exports = (sequelize, DataTypes, Model,Op) => {

    class userSummary extends Model {
        
         static async getrechargeList( attribute,  whereClause) {
        try {
          const result = await this.findAll({
            attributes: attribute,
            where: whereClause,
            limit: 5 // Add this line to set the limit to 5
          });
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }

    }

    userSummary.init({
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
          transaction_id: {
                type: DataTypes.INTEGER,
                allowNull: false
                },
          env: {
                type: DataTypes.STRING,
                allowNull: false
            },
          type: {
                type: DataTypes.STRING,
                allowNull: false
            },
          sub_type: {
                type: DataTypes.STRING,
                allowNull: true
            },
          opening_balance: {
                type: DataTypes.DOUBLE,
                allowNull: false
            },
          credit: {
            type: DataTypes.DOUBLE,
            allowNull: false
            },
          debit: {
            type: DataTypes.DOUBLE,
            allowNull: false
            },
          closing_balance: {
            type: DataTypes.DOUBLE,
            allowNull: false
            },
          tran_for:{
              type: DataTypes.STRING,
              allowNull: false
          },
          status:{
              type: DataTypes.INTEGER,
              allowNull: true
          },
          created_on: {
            type: DataTypes.STRING,
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
              type: DataTypes.DATE,
              allowNull: true
          },
          deleted_by: {
              type: DataTypes.INTEGER,
              allowNull: true
          },
          mlm_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique:true
            },
           first_name: {
            type: DataTypes.STRING,
            allowNull: false
            },
            last_name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique:true
            },
            mobile: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique:true
            },
            ConsumerNumber:{
                type: DataTypes.STRING,
                allowNull: false
            },
            recharge_amount: {
                type: DataTypes.DOUBLE,
                allowNull: false
            },
            recharge_type: {
                type: DataTypes.STRING,
                allowNull: false
            },
            recharge_status:{
                type: DataTypes.STRING,
                allowNull: true
            },
            operator_name:{
                type: DataTypes.STRING,
                allowNull: false
            },
            service_name:{
                type: DataTypes.STRING,
                allowNull: false
            },
            category:{
                type: DataTypes.STRING,
                allowNull: false
            },
            operator_image:{
                type: DataTypes.STRING,
                allowNull: false
            },
            reference_no:{
                type: DataTypes.STRING,
                allowNull: true
            },
            discription: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            circle_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
     }, {
        sequelize, 
        modelName: 'userSummary',
        tableName: 'view_user_summary', // specify table name here
        timestamps: false
      });
      
      return userSummary;
}


