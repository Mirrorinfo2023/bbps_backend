// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

    class Package extends Model {

     
      
     
        static async UpdateData(data, whereClause) {
        try {
            const updateRecharge = await this.update(data, {
                where: whereClause
            });
            if(updateRecharge){
                return { error: 0, message: 'Updated', result:updateRecharge.id };
            }else{
                return { error: 1, message: 'Not update', result:'' };
            }
            
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
        static async getAllDataList(page,pageSize) {
        const offset = (page - 1) * pageSize;

       
        try {
          const result = await this.findAll({
            where: {
                status: 1
            },
            limit: pageSize,
            offset: offset
        });
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
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
      
   
      
      
      
    }

    Package.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		  primaryKey: true,
		  autoIncrement: true
        },
        package_name:{
            type: DataTypes.STRING,
            allowNull: false
        },
         package_amount: {
              type: DataTypes.DECIMAL,
              allowNull: false
        },
         package_details: {
              type: DataTypes.STRING,
              allowNull: false
        },
         without_gst: {
              type: DataTypes.DECIMAL,
              allowNull: true
        }, gst: {
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
        modified_on: {
          type: DataTypes.DATE,
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
          type: DataTypes.STRING,
          allowNull: true
        }, 
        status: {
          type: DataTypes.INTEGER,
          allowNull: true
        }
  
      },
      {
        sequelize, 
        modelName: 'Package',
        tableName: 'mst_vendor_package', // specify table name here
        timestamps: false
      });
      
      return Package;
}


