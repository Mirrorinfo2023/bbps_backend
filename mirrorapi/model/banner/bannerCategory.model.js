// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

  class bannerCategory extends Model {
    static async getBannerCategory() {
      const bannerCategory = await this.findAll({
        order: [['id', 'DESC']],
      });
      return bannerCategory;
    }

  }





  bannerCategory.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    category_name: {
      type: DataTypes.STRING,
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



  },
    {
      sequelize,
      modelName: 'bannerCategory',
      tableName: 'mst_banner_category', // specify table name here
      timestamps: false
    });

  return bannerCategory;
}


