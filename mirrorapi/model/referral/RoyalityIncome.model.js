const { Sequelize, Model, DataTypes, Op, sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes, Model) => {

    class RoyalityIncome extends Model {
        
      

    static async insertData(data) {
        try {
          const result = await this.create(data);
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
    
     static async updateMany() {
        
        try {
            
           const result = await this.update(
           
            { is_active: 0 } ,
           {where: { old_flag: 1}} 
        );
          
          return result;
          
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
        
        
      }
    static async updateData(data,user_id,level) {
        
        try {
            
           const result = await this.update(data, {
               
            where: { user_id: user_id ,level:level,old_flag:0}
            
          });
          
          return result;
          
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
        
        
      }
      
       static async updateUser(data,user_id) {
        
        try {
            
           const result = await this.update(data, {
               
            where: { user_id: user_id}
            
          });
          
          return result;
          
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
        
        
      }
      
      
      
      
       
      
    static async getCount(user_id,level) {
        try {
          const result = await this.count({
            where: {user_id,level}
          });
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      
       static async getCountUser(user_id) {
        try {
          const result = await this.count({
            where: {user_id}
          });
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      
      
      static async getCountflag(user_id,level,old_flag) {
        try {
          const result = await this.count({
            where: {user_id,level,old_flag}
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
      
       static async getSilverCountId() {
        try {
         
                const silvercount = await this.count({
                where: {
                level: 1,
                 is_active:1,
                 is_transfer:1,
                   royality_name:'Silver',
                total_income: {
        
                 [Sequelize.Op.gte]: 20000.00
                 
                },
                },
                });
             
          return silvercount;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      
            static async getMobilefundCountId() {
        try {
         
                const silvercount = await this.count({
                where: {
                level: 2,
                is_active:1,
                is_transfer:1,
                royality_name:'Mobile Fund',
                total_income: {
        
                 [Sequelize.Op.gte]: 100000.00
                 
                },
                },
                });
             
          return silvercount;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      
      
      
    static async getGoldCountId() {
        try {
         
                const Goldcount = await this.count({
                where: {
                level: 2,
                is_active:1,
                is_transfer:1,
                royality_name:'Gold',
                total_income: {
               [Sequelize.Op.gte]: 200000.00,
                },
                },
                });
             
          return Goldcount;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      
    static async getPlatinumCountId() {
        try {
         
                const Platinumcount = await this.count({
                where: {
                level: 3,
                is_active:1,
                is_transfer:1,
                royality_name:'Platinum',
                total_income: {
                [Sequelize.Op.gte]: 500000.00,
                },
                },
                });
             
          return Platinumcount;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
    
         static async getHouseFundCountId() {
        try {
         
                const silvercount = await this.count({
                where: {
                level: 3,
                is_active:1,
                is_transfer:1,
                royality_name:'House Fund',
                total_income: {
        
                 [Sequelize.Op.gte]: 250000.00
                 
                },
                },
                });
             
          return silvercount;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
    
    
     static async getTravelFundCountId() {
        try {
         
                const silvercount = await this.count({
                where: {
                level: 4,
                is_active:1,
                is_transfer:1,
                royality_name:'Travel Fund',
                total_income: {
        
                 [Sequelize.Op.gte]: 500000.00
                 
                },
                },
                });
             
          return silvercount;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      
      
        static async getCarFundCountId() {
        try {
         
                const silvercount = await this.count({
                where: {
                level: 2,
                is_active:1,
                is_transfer:1,
                royality_name:'Car Fund',
                total_income: {
        
                 [Sequelize.Op.gte]: 150000.00
                 
                },
                },
                });
             
          return silvercount;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
    
    
    



      static async getDiamondCountId() {
        try {
         
                const Diamondcount = await this.count({
                where: {
                level: 4,
                is_active:1,
                is_transfer:1,
                royality_name:'Diamond',
                total_income: {
                  [Sequelize.Op.gte]: 1000000.00,
                },
                },
                });
             
          return Diamondcount;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      
      
      
      
      
      
      
      

   

    }

    RoyalityIncome.init({
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
        level:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        total_income:{
            type: DataTypes.DECIMAL,
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
        
         royality_name:{
          type: DataTypes.STRING,
          allowNull: true
        },
         old_flag:{
            type: DataTypes.INTEGER,
            allowNull: true
        },
         is_active:{
            type: DataTypes.INTEGER,
            allowNull: true
        },
         is_transfer:{
            type: DataTypes.INTEGER,
            allowNull: true
        }
        
  
      },
      {
        sequelize, 
        modelName: 'RoyalityIncome',
        tableName: 'trans_royality_income', // specify table name here
        timestamps: false,
       
        
      });
      
      return RoyalityIncome;
}


