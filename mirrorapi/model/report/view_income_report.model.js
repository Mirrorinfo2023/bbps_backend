// Define the Countries model
module.exports = (sequelize, DataTypes, Model,Op) => {

    class incomeReport extends Model {
        
       
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
        const openingBalance = await this.findOne({
            attributes: ['opening_balance'],
            where: {...whereClause},
            order: [['id', 'ASC']],
        });

        const closingBalance = await this.findOne({
            attributes: ['closing_balance'],
            where: {...whereClause},
            order: [['id', 'DESC']],
        });

        const credit_amount = await this.findOne({
          attributes: [
            [sequelize.fn('SUM', sequelize.col('credit')), 'amount']
          ],
          where: {...whereClause}
        });
    
        const debit_amount = await this.findOne({
          attributes: [
            [sequelize.fn('SUM', sequelize.col('debit')), 'amount']
          ],
          where: {...whereClause}
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
             'opening_balance':parseFloat(openingBalance?openingBalance.opening_balance:'0.00').toFixed(2), 
             'closing_balance': parseFloat(closingBalance?closingBalance.closing_balance:'0.00').toFixed(2),
             'total_credit': parseFloat(cr_amount).toFixed(2), 
             'total_debit': parseFloat(dr_amount).toFixed(2), 
             'balance_amount': parseFloat(cr_amount-dr_amount).toFixed(2)
             
         }
        return response;
      }
      
      
      static async getTotalRepurchaseIncome(user_id)
      {
        const totalBalances = await this.findAll({
            attributes: [
                'details',
                [sequelize.fn('SUM', sequelize.col('credit')), 'amount']
              ],
            where: {
                tran_for: "Repurchase",
                user_id: user_id},
            group: ['details'],

        });
        let mobile  = (0.00).toFixed(2);
        let dth  = (0.00).toFixed(2);
        let bbps = (0.00).toFixed(2);
        for(const data of totalBalances)
        {
            if(data.details.includes('Mobile'))
            {
                mobile = parseFloat(data.amount).toFixed(2);
            }
            if(data.details.includes('DTH'))
            {
                dth = parseFloat(data.amount).toFixed(2);
            }
            if(data.details.includes('BBPS'))
            {
                bbps = parseFloat(data.amount).toFixed(2);
            }
        }

        const response = {'mobile': mobile, 'dth': dth, 'bbps': bbps};
        return response;
      }


    }


    incomeReport.init({
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

            env: {
                type: DataTypes.STRING,
                allowNull: false
            },
                
              registration_date:{
                  type: DataTypes.STRING,
                  allowNull: false
              },
              username: {
                    type: DataTypes.STRING,
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
                type: DataTypes.STRING,
                allowNull: false
            },
            transaction_id: {
                type: DataTypes.STRING,
                allowNull: false
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false
            },
            sub_type: {
                type: DataTypes.STRING,
                allowNull: false
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

            income_date:{
                type: DataTypes.STRING,
                allowNull: false
              },

            tran_for:{
              type: DataTypes.STRING,
              allowNull: false
            },
            details:{
                type: DataTypes.TEXT,
                allowNull: false
            },
            level:{
                type: DataTypes.INTEGER,
                allowNull: false
            },
            plan_name:{
                type: DataTypes.STRING,
                allowNull: false
            },
            sender_mobile:{
                type: DataTypes.STRING,
                allowNull: true
            },
            sender_mlm_id:{
                type: DataTypes.STRING,
                allowNull: true
            },
          
         
         
     }, {
        sequelize, 
        modelName: 'incomeReport',
        tableName: 'view_income_report', // specify table name here
        timestamps: false
      });
      
      return incomeReport;
}


