// Define the Countries model
const { Sequelize, Model, DataTypes, Op, sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes, Model) => {

    class employeeRole extends Model {
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
            const updateRecord = await this.update(data, {
                where: whereClause
            });
            if(updateRecord){
                return { error: 0, message: 'Updated', result:updateRecord.id };
            }else{
                return { error: 1, message: 'Not update', result:'' };
            }
            
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }


      static async getData(attributes,whereClause) {
        try {
            const result = await this.findOne({
            attributes: attributes,
            where: {
                ...whereClause
            }
            });
                    
            return result;
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }


      static async getDataCount(whereClause) {
        try {
            const result = await this.count({
                where: {
                    ...whereClause
                }
            });
                    
            return result;
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }


      static async getAllData(whereClause) {
        try {
            const results = await this.findAll({
                where: {
                    ...whereClause
                }
            });
                    
            return results;
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }


    }


    employeeRole.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		  primaryKey: true,
		  autoIncrement: true
        },
        role_name:{
            type: DataTypes.STRING,
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
        
        status: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
  
      },
      {
        sequelize, 
        modelName: 'employeeRole',
        tableName: 'mst_emplyee_role', // specify table name here
        timestamps: false
      });
      
      return employeeRole;
}


