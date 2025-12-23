// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

    class affiliate_user_track  extends Model {

      static async getInsuaranceDetails() {
            try{
            const banner = await this.findAll({
              order: [['created_on', 'DESC']],
            });
            return banner;

          } catch(err){
            logger.error(`Unable to find Banner: ${err}`);
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
      

    affiliate_user_track.init({
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
        affiliate_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        status: {
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
        updated_on: {
            type: DataTypes.DATE,
            allowNull: true
        },
        updated_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
     
        
      },
      {
        sequelize, 
        modelName: 'affiliate_user_track',
        tableName: 'tbl_affiliate_user_track_report', // specify table name here
        timestamps: false
      });
      
      return affiliate_user_track;
}

