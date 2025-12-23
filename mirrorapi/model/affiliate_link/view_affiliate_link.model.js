// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

    class viewaffiliate_link extends Model {

      static async getData(category_id) {
            try{
            const banner = await this.findAll({
              where: {
                  category_id: category_id,
                  status:1
              },
              order: [['id', 'DESC']],
            });
            return banner;
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


      static async getAffliateList(whereCondition) {
        try{
        const banner = await this.findAll({
          where: whereCondition,
          order: [['id', 'DESC']],
        });
        return banner;
        } catch(err){
            console.error('Error:', error);
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
    



    viewaffiliate_link.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		  primaryKey: true,
		  autoIncrement: true
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
      
        status: {
            type: DataTypes.STRING,
            allowNull: true
        },
        created_on: {
              type: DataTypes.DATE,
              allowNull: true
        },
        amount: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        valid_date: {
          type: DataTypes.DATE,
          allowNull: true
        },
        link_created_date: {
            type: DataTypes.STRING,
            allowNull: true
        },
     
        valid_till_date: {
            type: DataTypes.STRING,
            allowNull: true
        },

        category_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
       
     
        
      },
      {
        sequelize, 
        modelName: 'viewaffiliate_link',
        tableName: 'view_affiliate_link', // specify table name here
        timestamps: false
      });
      
      return viewaffiliate_link;
}


