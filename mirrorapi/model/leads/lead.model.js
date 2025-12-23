
module.exports = (sequelize, DataTypes, Model) => {

    class leads extends Model {

      static async getData() {
            const result = await this.findAll({
            order: [['id', 'DESC']],
            });
            return result;
      }

        static async getDataById(lead_id) {
        const result = await this.findOne({
          where: {id:lead_id},
          order: [['id', 'DESC']],
          });
          return result;
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

      static async getDataWithClause(whereClause) {
        try {
          const result = await this.findAll({
            where: {status:1, category_id:whereClause},
            order: [['sequence', 'ASC']],
          });
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }

      
      
      static async UpdateData(data , whereClause) {
        try {
     
          const result = await this.update(data, {
            where: whereClause
          });
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      
         static async getAllData(whereCondition) {
          try {
            const result = await this.findAll({
                where: whereCondition,
                order: [['created_on', 'DESC']],
              });
              return result;
          } catch (error) {
              console.error('Error:', error);
              throw error;
          }
        }

      

    }

    

      

    leads.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		  primaryKey: true,
		  autoIncrement: true
        },
        lead_name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        lead_field_lebel:{
          type: DataTypes.STRING,
          allowNull: false
        },
        category_id : {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        img : {
            type: DataTypes.TEXT,
            allowNull: false
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        specification: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
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
        sequence: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
         total_earning: {
          type: DataTypes.DECIMAL,
          allowNull: true
        },
        distribution_amount: {
          type: DataTypes.DECIMAL,
          allowNull: true
        },
        download_app_link: {
          type: DataTypes.STRING,
          allowNull: true
        },
        open_now_link: {
          type: DataTypes.STRING,
          allowNull: true
        },
        referral_link: {
          type: DataTypes.STRING,
          allowNull: true
        },
        video_link: {
          type: DataTypes.STRING,
          allowNull: true
        },
        banner_image : {
            type: DataTypes.STRING,
            allowNull: true
        },
        input_params: {
            type: DataTypes.STRING,
            allowNull: true
        }
        
      },
      {
        sequelize, 
        modelName: 'leads',
        tableName: 'tbl_leads', // specify table name here
        timestamps: false
      });
      
      return leads;
}


