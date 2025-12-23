const { Sequelize, Model, DataTypes, Op, sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes, Model) => {

    class RoyalityPrime extends Model {
        
        static async insertData(data) {
        try {
          const result = await this.create(data);
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      
      
      
        static async getCount(user_id,plan_id,ref_userid) {
        try {
          const result = await this.count({
            where: {user_id,plan_id,ref_userid}
          });
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
       static async updateData(data,ref_userid,level) {
        
        try {
            
           const result = await this.update(data, {
               
            where: { ref_userid ,level}
            
          });
          
          return result;
          
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
        
        
      }
      
      
      
       static async getLevelSumAmount(level,ref_userid) {
        
        try {
            const LevelSum = await this.sum('amount', {
                where: {
                    ref_userid:ref_userid,
                    level:level
                   
                },
            });
    
            return LevelSum?LevelSum:0;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
        
        
    }
      
      
      
      
    }

    RoyalityPrime.init({
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
        plan_id:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        amount:{
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        ref_userid:{
            type: DataTypes.INTEGER,
            allowNull: true
        },
         status:{
            type: DataTypes.INTEGER,
            allowNull: true
        },
          level:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        rank_id:{
            type: DataTypes.INTEGER,
            allowNull: false
        }
        
  
      },
      {
        sequelize, 
        modelName: 'RoyalityPrime',
        tableName: 'trans_royality_prime', // specify table name here
        timestamps: false,
       
        
      });
      
      return RoyalityPrime;
}


