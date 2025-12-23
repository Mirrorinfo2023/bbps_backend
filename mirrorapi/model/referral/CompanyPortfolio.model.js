const { Sequelize, Model, DataTypes, Op, sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes, Model) => {

    class CompanyPortfolio extends Model {
        
      

    static async insertData(data) {
        try {
          const result = await this.create(data);
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
    
    static async updateData(data,sub_category,portfolio_date) {
        
        try {
            
           const result = await this.update(data, {
               
            where: { sub_category:sub_category,portfolio_date:portfolio_date}
            
          });
          
          return result;
          
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
        
        
      }
      
       
      
    static async getCount(portfolio_date,sub_category) {
        try {
          const result = await this.count({
            where: {portfolio_date,sub_category}
          });
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
    
      static async getData(attribute, whereClause) {
        try {
         
          const result = await this.findOne({
            attributes: [...attribute],
            where: {...whereClause},
            order: [['id', 'DESC']],
          });
             
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
    
    
     static async getTodayAmount(todayDate) {
        try {
       
                // const currentDate = new Date();
                // currentDate.setDate(currentDate.getDate() - 1);
                // const year = currentDate.getFullYear();
                // const month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
                // const day = String(currentDate.getDate()).padStart(2, '0');
                // const todayDate = `${year}-${month}-${day}`;
                

                const result = await this.sum('total_amnt', {
                 where: { portfolio_date:todayDate},
                });
             
                return result || 0; 
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      
       static async getTodayTotalIds(todayDate) {
        try {
       
                // const currentDate = new Date();
                // currentDate.setDate(currentDate.getDate() - 1);
                // const year = currentDate.getFullYear();
                // const month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
                // const day = String(currentDate.getDate()).padStart(2, '0');
                // const todayDate = `${year}-${month}-${day}`;
                

                const result = await this.sum('total_ids', {
                 where: { portfolio_date:todayDate},
                });
             
                return result || 0; 
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
   

    }

    CompanyPortfolio.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		  primaryKey: true,
		  autoIncrement: true
        },
        total_ids:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        total_amnt:{
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        portfolio_date:{
             type: DataTypes.DATE,
             allowNull: true
        },
        category:{
          type: DataTypes.STRING,
          allowNull: false
        },
        sub_category:{
          type: DataTypes.STRING,
          allowNull: false
        },
        created_on:{
              type: DataTypes.DATE,
              allowNull: true
        },
        updated_on:{
             type: DataTypes.DATE,
             allowNull: true
        },
          royality_status:{
            type: DataTypes.INTEGER,
            allowNull: true
        },
          reward_status:{
            type: DataTypes.INTEGER,
            allowNull: true
        },
        
        
  
      },
      {
        sequelize, 
        modelName: 'CompanyPortfolio',
        tableName: 'trans_company_portfolio', // specify table name here
        timestamps: false,
       
        
      });
      
      return CompanyPortfolio;
}


