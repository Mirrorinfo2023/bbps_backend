// Define the Countries model
module.exports = (sequelize, DataTypes, Model,Op) => {

    class primeUserReport extends Model {
        
       
    
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


    primeUserReport.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
                primaryKey: true,
                autoIncrement: true
          },
          registration_date:{
              type: DataTypes.DATE,
              allowNull: false
          },
           user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
            },
          name: {
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
            email: {
                type: DataTypes.DOUBLE,
                allowNull: false
            },
            plan: {
                type: DataTypes.DOUBLE,
                allowNull: false
            },
            amount: {
                type: DataTypes.DOUBLE,
                allowNull: false
            },
            prime_date: {
                type: DataTypes.DATE,
                allowNull: false
            },
            refer_id:{
              type: DataTypes.STRING,
              allowNull: false
            },
            referal_name:{
                type: DataTypes.STRING,
                allowNull: false
            },
            refer_mobile:{
                type: DataTypes.STRING,
                allowNull: false
            },
            refer_email:{
                type: DataTypes.STRING,
                allowNull: false
            },
            wallet_balance:{
                type: DataTypes.STRING,
                allowNull: false
            },
            cashback_balance:{
                type: DataTypes.STRING,
                allowNull: false
            },
            reedem_balance:{
                type: DataTypes.STRING,
                allowNull: false
            },
       
         
         
     }, {
        sequelize, 
        modelName: 'primeUserReport',
        tableName: 'view_prime_user_report', // specify table name here
        timestamps: false
      });
      
      return primeUserReport;
}


