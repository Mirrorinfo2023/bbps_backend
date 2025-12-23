
module.exports = (sequelize, DataTypes, Model) => {

    class campaigns extends Model {

      static async getData(whereClause=null) {
            try{
            const result = await this.findAll({
              where: {
                  status:1,
                  ...whereClause
              },
              order: [['id', 'DESC']],
            });
            return result;
            } catch(err){
                console.error('Error:', error);
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
            const updateData = await this.update(data, {
                where: whereClause
            });
            if(updateData){
                return { error: 0, message: 'Updated', result:updateData.id };
            }else{
                return { error: 1, message: 'Not update', result:'' };
            }
            
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }


    }
    


    
    campaigns.init({
        id : {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        campaign_id : {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        name : {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        url : {
            type: DataTypes.TEXT,
            allowNull: true,
        }, 
        domain : {
            type: DataTypes.TEXT,
            allowNull: true,
        }, 
        payout_type : {
            type: DataTypes.STRING,
            allowNull: true,
        },
        payout : {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        image : {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        additional_info : {
            type: DataTypes.TEXT,
            allowNull: true,
        } ,
        important_info : {
            type: DataTypes.TEXT,
            allowNull: true,
        }, 
        last_modified : {
            type: DataTypes.DATE,
            allowNull: true,
        },
        payout_categories : {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        category_id : {
            type: DataTypes.BIGINT,
            allowNull: true,
        },
        category_name : {
            type: DataTypes.STRING,
            allowNull: true,
        },
        countries : {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        reporting_type : {
            type: DataTypes.STRING,
            allowNull: true,
        },
        deeplink_allowed : {
            type: DataTypes.STRING,
            allowNull: true,
        },
        sub_ids_allowed : {
            type: DataTypes.STRING,
            allowNull: true,
        },
        cashback_publishers_allowed : {
            type: DataTypes.STRING,
            allowNull: true,
        },
        social_media_publishers_allowed : {
            type: DataTypes.STRING,
            allowNull: true,
        },
        missing_transactions_accepted : {
            type: DataTypes.STRING,
            allowNull: true,
        },
        response_json : {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        created_on : {
            type: DataTypes.DATE,
            allowNull: true,
        },
        status : {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        categories: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        affiliate_url: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        shorten_url: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        payout_amount: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        }
        
      },
      {
        sequelize, 
        modelName: 'campaigns',
        tableName: 'tbl_campaigns', // specify table name here
        timestamps: false
      });
      
      return campaigns;
}


