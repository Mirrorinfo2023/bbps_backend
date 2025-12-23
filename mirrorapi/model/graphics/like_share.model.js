
module.exports = (sequelize, DataTypes, Model) => {

    class LikeShare extends Model {

      static async makeLikeAndShare(graphics_id, user_id, action) {
        try {
            const is_like = action==='Like'?1:0;
            const is_share = action==='Share'?1:0;
            let date = new Date();
            let result = {};

            const getRecord = await this.findOne({
                where: {graphics_id,user_id, status:1},
                });
            if(getRecord === null)
            {
                result = await this.create({
                    user_id,
                    graphics_id,
                    is_like,
                    like_count:is_like,
                    is_share,
                    share_count:is_share
                });
            }else{
                const like_count = getRecord.like_count+is_like;
                const share_count = getRecord.share_count+is_share;
                const isLike = getRecord.is_like==0?getRecord.is_like+is_like:1;
                const isShare = getRecord.is_share==0?getRecord.is_share+is_share:1;
                
                result = await this.update(
                    {is_like:isLike, is_share: isShare, like_count:like_count, share_count:share_count,modified_on:date.getTime()},
                    { where: { id:getRecord.id }}
                );
            }
     
          
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }


      static async getLikeAndShare(graphics_id, user_id) {
        try {
            const getRecord = await this.findOne({
                where: {graphics_id,user_id, status:1},
                });
            return getRecord;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }

    }

      

    LikeShare.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		  primaryKey: true,
		  autoIncrement: true
        },
        user_id: {
          type: DataTypes.BIGINT,
          allowNull: false
        },
        graphics_id:{
          type: DataTypes.BIGINT,
          allowNull: false
        },
        is_like : {
            type: DataTypes.TINYINT,
            allowNull: true
        },
        like_count : {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        is_share: {
            type: DataTypes.TINYINT,
            allowNull: true
        },
        share_count: {
            type: DataTypes.INTEGER,
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
        modified_on: {
            type: DataTypes.DATE,
            allowNull: true
        }
        
      },
      {
        sequelize, 
        modelName: 'LikeShare',
        tableName: 'tbl_like_share_details', // specify table name here
        timestamps: false
      });
      
      return LikeShare;
}


