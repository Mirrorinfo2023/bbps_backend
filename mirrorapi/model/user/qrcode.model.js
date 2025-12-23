// Define the Countries model
module.exports = (sequelize, DataTypes, Model,Op) => {

    class qrcode extends Model {

      static async getData(attribute, whereClause) {
        try {
          const fixedCondition = {status: 1};
          const result = await this.findOne({
            attributes: [...attribute],
            where: {...fixedCondition, ...whereClause}
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
       

      static async updateData(data,whereClause) {
        try {
          // console.log(data);
          const result = await this.update(data, {
            where: whereClause
          });
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }


      
    }

    qrcode.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		      primaryKey: true,
		      autoIncrement: true
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: true
          },
       
          mobile: {
              type: DataTypes.STRING,
              allowNull: false,
              unique:true
          },
          qrcode: {
              type: DataTypes.STRING,
              allowNull: false
          },
     
           status: {
              type: DataTypes.INTEGER,
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
          
         
     }, {
        sequelize, 
        modelName: 'qrcode',
        tableName: 'tbl_qrcode_generate', // specify table name here
        timestamps: false
      });
      
      return qrcode;
}


