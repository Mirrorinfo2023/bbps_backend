// Define the Countries model
module.exports = (sequelize, DataTypes, Model,Op) => {

    class distributionReport extends Model {
        
       
       static async getAllData(whereCondition) {
        try {
          const result = await this.findAll({
              where: whereCondition,
              order: [['level', 'ASC'], ['id', 'DESC']],
            });
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }

    }

    distributionReport.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
                primaryKey: true,
                autoIncrement: true
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

            created_on:{
                type: DataTypes.DATE,
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
          
         
         
     }, {
        sequelize, 
        modelName: 'distributionReport',
        tableName: 'view_income_distribution', // specify table name here
        timestamps: false
      });
      
      return distributionReport;
}


