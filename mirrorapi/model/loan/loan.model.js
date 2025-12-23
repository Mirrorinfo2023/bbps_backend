// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

  class LoanRequest extends Model {

   
    
   
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
    
        
    static async getPendingCount(user_id) {
        try {
          const result = await this.count({
            where: {user_id,status:0}
          });
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
    
 
    
    
    
  }

  LoanRequest.init({
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
      rank:{
          type: DataTypes.STRING,
          allowNull: false
      },
       amount: {
            type: DataTypes.DECIMAL,
            allowNull: false
      },
       email: {
            type: DataTypes.STRING,
            allowNull: false
      },
       mobile: {
            type: DataTypes.STRING,
            allowNull: true
      },
      
       remarks: {
            type: DataTypes.STRING,
            allowNull: true
      },
      approval_remarks: {
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
      modelName: 'loan',
      tableName: 'trans_loan_request', // specify table name here
      timestamps: false
    });
    
    return LoanRequest;
}