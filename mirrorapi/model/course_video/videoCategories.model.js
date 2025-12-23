const { Sequelize, Model, DataTypes, Op, sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes, Model) => {

  class videoCategory extends Model {

    static async insertData(data) {
      try {
        const result = await this.create(data);
        return result;
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
    }

    static async getAllData(parent = null) {
      let whereCondition = {
        status: 1
      };

      if (parent !== null) {
        whereCondition.parent_id = 0;
      }

      try {
        const result = await this.findAll({
          where: whereCondition,
          order: [['id', 'ASC']]
        });
        return result;
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
    }

    static async getDataWithClause(whereClause) {
      try {
        const result = await this.findAll({
          where: { status: 1, category_name: whereClause },
          order: [['created_on', 'ASC']],
        });
        return result;
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
    }

    static async getChildCategory(parent_id) {
      try {
        const result = await this.findAll({
          where: { status: 1, parent_id: parent_id },
          order: [['created_on', 'ASC']],
        });
        return result;
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
    }

    static async getData(attribute, whereCondition) {
      try {
        const result = await this.findOne({
          attributes: [...attribute],
          where: whereCondition,

        });
        return result;
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
    }


    static async updateData(data, id) {
      try {
        // console.log(data);
        const result = await this.update(data, {
          where: { id: id }
        });
        return result;
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
    }








  }





  videoCategory.init({
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
    parent_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    img: {
      type: DataTypes.TEXT,
      allowNull: true
    },


  },
    {
      sequelize,
      modelName: 'videoCategory',
      tableName: 'mst_video_category', // specify table name here
      timestamps: false
    });

  return videoCategory;
}


