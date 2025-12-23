// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

    class viewInsurance extends Model {

      static async getData(whereClause) {
            try{
            const result = await this.findOne({
              
                where: {...whereClause},
                order: [['id', 'DESC']]
            });
            return result;
          } catch(err){
              logger.error(`Unable to find: ${err}`);
          }
      }

      static async getDataById(whereClause) {
        try{
        const result = await this.findAll({
          
            where: {...whereClause},
            order: [['id', 'DESC']]
        });
        return result;
      } catch(err){
          logger.error(`Unable to find: ${err}`);
      }
  }

    }
      

    viewInsurance.init({
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
        ins_no: {
          type: DataTypes.STRING,
          allowNull: false
        },
        ins_type: {
          type: DataTypes.STRING,
          allowNull: false
        },
        form_data: {
          type: DataTypes.TEXT,
          allowNull: false
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
          type: DataTypes.BIGINT,
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
        first_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        mlm_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        mobile: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true
        },
        entry_date: {
            type: DataTypes.STRING,
            allowNull: true
        }
        
      },
      {
        sequelize, 
        modelName: 'viewInsurance',
        tableName: 'view_insurance', // specify table name here
        timestamps: false
      });
      
      return viewInsurance;
}


