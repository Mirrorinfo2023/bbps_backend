// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

    class insuarnce extends Model {

      static async getBanner(type_id) {
            try{
            const banner = await this.findAll({
              
              where: {
                  type_id: type_id
              },
              order: [['id', 'DESC']],
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

      

      // static async updateData(data,id) {
      //   try {
      //     // console.log(data);
      //     const result = await this.update(data, {
      //       where: { id :id }
      //     });
      //       return result;
      //   } catch (error) {
      //       console.error('Error:', error);
      //       throw error;
      //   }
      // }

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
      

    insuarnce.init({
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
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false
          },
        siId : {
              type: DataTypes.STRING,
              allowNull: false
        },
        product_name: {
              type: DataTypes.STRING,
              allowNull: false
        },
        lead_provide_id: {
              type: DataTypes.STRING,
              allowNull: false
        },
        quotationUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },
        product_provider_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        vleMargin: {
            type: DataTypes.STRING,
            allowNull: true
        },
        amount: {
            type: DataTypes.STRING,
            allowNull: true
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
        deleted_on: {
            type: DataTypes.DATE,
            allowNull: true
        },
        deleted_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        
      },
      {
        sequelize, 
        modelName: 'insuarnce',
        tableName: 'tbl_insuarnce', // specify table name here
        timestamps: false
      });
      
      return insuarnce;
}


