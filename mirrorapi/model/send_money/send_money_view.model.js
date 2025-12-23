// Define the model
module.exports = (sequelize, DataTypes, Model) => {

    class send_money_view extends Model {
     
      static async getList(  attribute, whereClause) {
        try {
          const result = await this.findAll({
            attributes: attribute,
            where: whereClause,
             limit: 5 // Add this line to set the limit to 5
          });
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }

    }

    send_money_view.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        from_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        to_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },              
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false
        },
        env: {
            type: DataTypes.STRING,
            allowNull: false
        },
        created_on: {
            type: DataTypes.STRING,
            allowNull: true
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        updated_on: {
            type: DataTypes.DATE,
            allowNull: true
        },
        updated_by: {
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
        first_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        mobile: {
            type: DataTypes.STRING,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        wallet: {
            type: DataTypes.STRING,
            allowNull: true
        },
  
    },
    {
        sequelize, 
        modelName: 'send_money_view',
        tableName: 'view_send_money', // specify table name here
        timestamps: false
    });
      
    return send_money_view;
}


