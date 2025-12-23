// Define the Countries model
module.exports = (sequelize, DataTypes, Model,Op) => {

    class user_profile_details extends Model {

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

    user_profile_details.init({
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
       
            education: {
              type: DataTypes.STRING,
              allowNull: true,
              
            },
            profession: {
              type: DataTypes.STRING,
              allowNull: true
            },
            product_selling_exprience: {
                type: DataTypes.STRING,
                allowNull: true
            },
            experience_fields:
            {
                type: DataTypes.STRING,
                allowNull: true
            },
            previous_monthly_earning:
            {
                type: DataTypes.DOUBLE,
                allowNull: true
            },
            
            expected_monthly_earning:
            {
                type: DataTypes.DOUBLE,
                allowNull: true
            },
            
            having_two_wheeler:
            {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            vehicle_no:
            {
                type: DataTypes.STRING,
                allowNull: true
            },
            vehicle_budget:
            {
                type: DataTypes.DOUBLE,
                allowNull: true
            },
            having_car:
            {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            car_vehicle_no:
            {
                type: DataTypes.STRING,
                allowNull: true
            },
            car_purchase_budget:
            {
                type: DataTypes.DOUBLE,
                allowNull: true
            },
            own_house:
            {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            house_budget:
            {
                type: DataTypes.DOUBLE,
                allowNull: true
            },
            married:
            {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            child:
            {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            
            insurance:
            {
                type: DataTypes.TEXT,
                allowNull: true
            },
            
            sip_mutual_fund:
            {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            amount_investment:
            {
                type: DataTypes.DOUBLE,
                allowNull: true
            },
            target_wealth:
            {
                type: DataTypes.DOUBLE,
                allowNull: true
            },
            amount_investment:
            {
                type: DataTypes.DOUBLE,
                allowNull: true
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
       
         
     }, {
        sequelize, 
        modelName: 'user_profile_details',
        tableName: 'tbl_app_user_details', // specify table name here
        timestamps: false
      });
      
      return user_profile_details;
}


