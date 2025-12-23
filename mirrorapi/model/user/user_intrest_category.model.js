// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

  class intrestCategory extends Model {

      static async getCategory() {
          const feedbackCategory = await this.findAll({
          order: [['id', 'DESC']],
          });
          return feedbackCategory;
    }


  }

  

    

  intrestCategory.init({
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      intrest_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      icon : {
            type: DataTypes.TEXT,
            allowNull: false
      },
      
      status: {
          type: DataTypes.INTEGER,
          allowNull: false
      },
      created_on: {
            type: DataTypes.DATE,
            allowNull: false
      },
      created_by: {
          type: DataTypes.INTEGER,
          allowNull: false
    },
      
      

    },
    {
      sequelize, 
      modelName: 'intrestCategory',
      tableName: 'mst_user_interest_category', // specify table name here
      timestamps: false
    });
    
    return intrestCategory;
}


