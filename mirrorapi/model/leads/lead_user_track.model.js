const { Sequelize, Model, DataTypes, Op, sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes, Model) => {

    class lead_user_track  extends Model {

      static async getLeadsDetails(whereCondition) {
            try{
            const result = await this.findAll({
                
                
              attributes: [
                'id',
                'user_id',
                'created_by',
                'status',
                
                [Sequelize.fn('date_format', Sequelize.col('created_on'), '%d-%m-%Y %H:%i:%s'), 'created_on'],
               
              ],
              
                where:whereCondition,
                order: [['created_on', 'DESC']],
            });
            return result;

          } catch(err){
            logger.error(`Unable to find Record: ${err}`);
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

      static async updateData(data, whereClause) {
        try {
            const updateInsuarnce = await this.update(data, {
                where: whereClause
            });
            if(updateInsuarnce){
                return { error: 0, message: 'Updated', result:updateInsuarnce.id };
            }else{
                return { error: 1, message: 'Not update', result:'' };
            }
            
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }


    }
      

    lead_user_track.init({
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
       
        status: {
            type: DataTypes.STRING,
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
        modified_on: {
            type: DataTypes.DATE,
            allowNull: true
        },
        modified_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
      
      },
      {
        sequelize, 
        modelName: 'lead_user_track',
        tableName: 'tbl_leads_user_track_details', // specify table name here
        timestamps: false
      });
      
      return lead_user_track;
}


