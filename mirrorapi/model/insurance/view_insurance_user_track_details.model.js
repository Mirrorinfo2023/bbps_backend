// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

    class view_insurance_user_track_details  extends Model {

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
      

    view_insurance_user_track_details.init({
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
        amount: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        type: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // phone: {
        //     type: DataTypes.STRING,
        //     allowNull: false
        //   },
        // siId : {
        //       type: DataTypes.STRING,
        //       allowNull: false
        // },
        // product_name: {
        //       type: DataTypes.STRING,
        //       allowNull: false
        // },
        // lead_provide_id: {
        //       type: DataTypes.STRING,
        //       allowNull: false
        // },
        // quotationUrl: {
        //     type: DataTypes.STRING,
        //     allowNull: true
        // },
        // product_provider_name: {
        //     type: DataTypes.STRING,
        //     allowNull: true
        // },
        // vleMargin: {
        //     type: DataTypes.STRING,
        //     allowNull: true
        // },
        // amount: {
        //     type: DataTypes.STRING,
        //     allowNull: true
        // },
        status: {
            type: DataTypes.STRING,
            allowNull: true
        },
        created_on: {
              type: DataTypes.STRING,
              allowNull: true
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        modified_on: {
            type: DataTypes.STRING,
            allowNull: true
        },
        modified_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        deleted_on: {
            type: DataTypes.STRING,
            allowNull: true
        },
        deleted_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        mlm_id: {
            type: DataTypes.STRING,
            allowNull: false,
           
        },
        first_name: {
             type: DataTypes.STRING,
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
     
        usermobile: {
            type: DataTypes.INTEGER,
            allowNull: false,
            
        },
        
      },
      {
        sequelize, 
        modelName: 'view_insurance_user_track_details',
        tableName: 'view_insurance_user_track_details', // specify table name here
        timestamps: false
      });
      
      return view_insurance_user_track_details;
}


