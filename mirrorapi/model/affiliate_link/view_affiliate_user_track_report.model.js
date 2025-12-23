// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

    class view_affilite_user_track  extends Model {

      static async getAffiliateDetails(whereCondition) {
            try{
            const banner = await this.findAll({
            //   order: [['created_on', 'DESC']],
            where:whereCondition,
            });
            return banner;

          } catch(err){
            console.error('Error:', err);
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
      

    view_affilite_user_track.init({
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
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        link: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        image: {
            type: DataTypes.TEXT,
            allowNull: false
          },
        category_id : {
              type: DataTypes.INTEGER,
              allowNull: false
        },
        mlm_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique:true
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        mobile: {
            type: DataTypes.STRING,
            allowNull: false,
            
        },
        category_name: {
            type: DataTypes.STRING,
            allowNull: false,
            
        },
        track_created_date: {
            type: DataTypes.STRING,
            allowNull: false,
        },
         amount: {
            type: DataTypes.STRING,
            allowNull: true,
        },
     
        
      },
      {
        sequelize, 
        modelName: 'view_affilite_user_track',
        tableName: 'view_affilite_user_track_report', // specify table name here
        timestamps: false
      });
      
      return view_affilite_user_track;
}

