const { Sequelize, Model, DataTypes, Op, sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class videoInteraction extends Sequelize.Model {

    // Insert a new interaction
    static async insertData(data) {
      try {
        const result = await this.create(data);
        return result;
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
    }

    // Get interactions for a video
    static async getVideoInteractions(video_id) {
      try {
        const result = await this.findAll({
          where: { video_id },
          order: [['created_on', 'DESC']]
        });
        return result;
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
    }

    // Get counts of likes, unlikes, favorites and comments
    static async getCounts(video_id) {
      try {
        const interactions = await this.findAll({ where: { video_id } });
        const likes_count = interactions.filter(i => i.type === 'like').length;
        const unlikes_count = interactions.filter(i => i.type === 'unlike').length;
        const favorite_count = interactions.filter(i => i.type === 'favorite').length;
        const comments = interactions.filter(i => i.type === 'comment');

        return { likes_count, unlikes_count, favorite_count, comments };
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
    }

    // Check if user has liked/favorited
    static async checkUserAction(video_id, user_id, type) {
      try {
        const result = await this.findOne({ where: { video_id, user_id, type } });
        return result ? true : false;
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
    }

    // Remove interaction (unlike/unfavorite)
    static async removeInteraction(video_id, user_id, type) {
      try {
        const result = await this.destroy({ where: { video_id, user_id, type } });
        return result;
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
    }
  }

  videoInteraction.init({
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
    video_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('like', 'unlike', 'comment', 'favorite'),
      allowNull: false
    },
    comment_text: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
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
  },
    {
      sequelize,
      modelName: 'videoInteraction',
      tableName: 'tbl_videocourse_interactions',
      timestamps: false
    });

  return videoInteraction;
};
