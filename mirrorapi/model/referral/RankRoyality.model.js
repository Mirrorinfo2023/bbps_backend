const { Sequelize, Model, DataTypes, Op, sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes, Model) => {

    class RankRoyality extends Model {
        
      
    static async getAllTargetRank() {
        try {
          const users = await this.findAll({
            where: {
              status: 1
            },
            order: [['sequence', 'ASC']]
          });
          return users;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      
        
      static async getLevelRoyality(amount)
      {
          const getRank = await this.findOne({
            attributes: ['level','rank'],
            where:{
              target: {
                  // [Op.gte]: amount,
                  [Op.lte]: amount
              }
            },
            order: [['id', 'DESC']],
            raw: true,
            nest:true
          });
          return getRank;
      }
    
    

   

    }

    RankRoyality.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		      primaryKey: true,
		      autoIncrement: true
        },
        rank:{
            type: DataTypes.STRING,
            allowNull: false
        },
        level:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        target:{
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        status:{
            type: DataTypes.INTEGER,
            allowNull: true
        },
        sequence: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
        
  
      },
      {
        sequelize, 
        modelName: 'RankRoyality',
        tableName: 'mst_rank_royality', // specify table name here
        timestamps: false,
       
        
      });
      
      return RankRoyality;
}


