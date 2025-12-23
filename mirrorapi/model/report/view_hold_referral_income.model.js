// Define the Countries model
module.exports = (sequelize, DataTypes, Model,Op) => {

    class holdIncomeReport extends Model {
        
       
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
      
      static async getAmount(whereClause) {
        
        const credit_amount = await this.findOne({
          attributes: [
            [sequelize.fn('SUM', sequelize.col('amount')), 'amount']
          ],
          where: {...whereClause, type: 'Credit'}
        });
    
        const debit_amount = await this.findOne({
          attributes: [
            [sequelize.fn('SUM', sequelize.col('amount')), 'amount']
          ],
          where: {...whereClause, type: 'Debit'}
        });
        
        let cr_amount=(0.00).toFixed(2);
        let dr_amount =(0.00).toFixed(2);
        
        if(credit_amount && credit_amount.dataValues.amount !== null 
        && credit_amount.dataValues.amount>=0){
            
            cr_amount = credit_amount.dataValues.amount;
        }
        
        if(debit_amount && debit_amount.dataValues.amount !== null 
        && debit_amount.dataValues.amount>=0){
            
            dr_amount = debit_amount.dataValues.amount;
        }
        
         const response = {
             'total_credit': parseFloat(cr_amount).toFixed(2), 
             'total_debit': parseFloat(dr_amount).toFixed(2), 
             'balance_amount': parseFloat(cr_amount-dr_amount).toFixed(2)
             
         }
        return response;
      }
        

    }


    holdIncomeReport.init({
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
                type: DataTypes.BIGINT,
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
          amount: {
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
            type: DataTypes.DATE,
            allowNull: true
            },
          created_by: {
          type: DataTypes.INTEGER,
          allowNull: true
          }, 
          details:{
              type: DataTypes.STRING,
              allowNull: false
          },
          sender_id:{
              type: DataTypes.INTEGER,
              allowNull: false
          },
           level:{
              type: DataTypes.INTEGER,
              allowNull: false
          },
          shopping_order_id:{
              type: DataTypes.INTEGER,
              allowNull: false
          },
          mlm_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique:true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            username: {
              type: DataTypes.STRING,
              allowNull: false
              },
              email: {
                type: DataTypes.STRING,
                allowNull: false
            },
            mobile: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            income_date: {
                type: DataTypes.STRING,
                allowNull: false,
            }
    
          
         
         
     }, {
        sequelize, 
        modelName: 'holdIncomeReport',
        tableName: 'view_hold_referral_income', // specify table name here
        timestamps: false
      });
      
      return holdIncomeReport;
}


