// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

    class insurance extends Model {

      static async getData(whereClause) {
            try{
            const result = await this.findOne({
              
              where: {...whereClause},
              order: [['id', 'DESC']],
            });
            return result;
          } catch(err){
              logger.error(`Unable to find: ${err}`);
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
            const updateInsurance = await this.update(data, {
                where: whereClause
            });
            if(updateInsurance){
                return { error: 0, message: 'Updated', result:updateInsurance.id };
            }else{
                return { error: 1, message: 'Not update', result:'' };
            }
            
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }


    }
      

    insurance.init({
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
        }
        
      },
      {
        sequelize, 
        modelName: 'insurance',
        tableName: 'tbl_insurance', // specify table name here
        timestamps: false
      });
      
      return insurance;
}


