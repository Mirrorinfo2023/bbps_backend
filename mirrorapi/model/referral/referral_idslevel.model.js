const { Sequelize, Model, DataTypes, Op, sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes, Model) => {

    class referral_idslevel extends Model {
        
        
    static async insertData(data) {
        try {
          const result = await this.create(data);
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }

    static async getCount(user_id,ref_userid,level) {
        try {
          const result = await this.count({
            // where: {user_id,ref_userid,level}
             where: { user_id,ref_userid,level,
                        created_on: {
                        [Sequelize.Op.gte]: '2024-02-27',
                    },
             }
          });
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      
      
      static async getReferralCount(ref_userid,level) {
        try {
          const result = await this.count({
            // where: {user_id,ref_userid,level}
             where: { ref_userid,level}
          });
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }


       static async getReferralUserIdsLevel1(ref_userid, level) {
        try {
          const results = await this.findAll({
            where: { ref_userid, level },
            attributes: ['user_id'] // only fetch user_id
          });

          // Map to array of user_ids
          const userIds = results.map(record => record.user_id);

          return userIds;
        } catch (error) {
          console.error('Error:', error);
          throw error;
        }
      }

      
      static async getRefralUser(user_id) {
        try {
            const result = await this.findAll({
                where: {
                    'user_id': user_id,
                    'status': 1,
                    'level': {
                        [Op.lte]: 15
                    }
                }
            });
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      
      static async getShoppingRefralUser(user_id) {
        try {
            const result = await this.findAll({
                where: {
                    'user_id': user_id,
                    'status': 1,
                    'level': {
                        [Op.lte]: 14
                    }
                }
            });
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      
        static async getMemberIdsPlan(param1 = '', param2 = '') {
            let where = {
                level: {
                    [Sequelize.Op.between]: [1, 10]
                }
            };
        
            if (param2 === '1') {
                where.level = { [Sequelize.Op.between]: [1, 10] };
            }
            if (param2 === '2') {
                where.level = { [Sequelize.Op.between]: [1, 25] };
            }
            if (param2 === '3') {
                where.level = { [Sequelize.Op.between]: [1, 15] };
            }
            if (param2 === '4') {
                where.level = { [Sequelize.Op.between]: [1, 15] };
            }
            
            if (param2 === '9' || param2 === '10' || param2 === '11') {
                where.level = { [Sequelize.Op.between]: [1, 15] };
            }
   			if (param2 === '111') {
                where.level = { [Sequelize.Op.between]: [1, 1] };
            }
			if (param2 === '222') {
                where.level = { [Sequelize.Op.between]: [1, 2] };
            }
			if (param2 === '333') {
                where.level = { [Sequelize.Op.between]: [1, 3] };
            }
			if (param2 === '444') {
                where.level = { [Sequelize.Op.between]: [1, 4] };
            }
        
            try {
                const result = await this.findAll({
                    where: {
                        ...where,
                        user_id: param1
                    }
                });
        
                return result;
            } catch (error) {
                console.error('Error executing query:', error.message);
                throw error;
            }
        }




		static async getMemberIdsPlanRef(param1 = '', param2 = '') {
            let where = {
                level: {
                    [Sequelize.Op.between]: [1, 10]
                }
            };
        
            if (param2 === '1') {
                where.level = { [Sequelize.Op.between]: [1, 10] };
            }
            if (param2 === '2') {
                where.level = { [Sequelize.Op.between]: [1, 25] };
            }
            if (param2 === '3') {
                where.level = { [Sequelize.Op.between]: [1, 15] };
            }
            if (param2 === '4') {
                where.level = { [Sequelize.Op.between]: [1, 15] };
            }
            
            if (param2 === '9' || param2 === '10' || param2 === '11') {
                where.level = { [Sequelize.Op.between]: [1, 15] };
            }
   			if (param2 === '111') {
                where.level = { [Sequelize.Op.between]: [1, 1] };
            }
			if (param2 === '222') {
                where.level = { [Sequelize.Op.between]: [1, 2] };
            }
			if (param2 === '333') {
                where.level = { [Sequelize.Op.between]: [1, 3] };
            }
			if (param2 === '444') {
                where.level = { [Sequelize.Op.between]: [1, 4] };
            }
        
            try {
                const result = await this.findAll({
                    where: {
                        ...where,
                        ref_userid: param1
                    }
                });
        
                return result;
            } catch (error) {
                console.error('Error executing query:', error.message);
                throw error;
            }
        }




   

    }





    referral_idslevel.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		      primaryKey: true,
		      autoIncrement: true
        },
        user_id:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
         ref_userid:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        mlm_id:{
            type: DataTypes.STRING,
            allowNull: false
        },
        level:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        
        status:{
            type: DataTypes.INTEGER,
            allowNull: true
        },
        created_on: {
          type: DataTypes.DATE,
          allowNull: true
          }
        
  
      },
      {
        sequelize, 
        modelName: 'referral_idslevel',
        tableName: 'tbl_referral_idslevel', // specify table name here
        timestamps: false,
        indexes: [
          {
            unique: true,
            fields: ['user_id', 'ref_userid'],
          },
        ],
        
      });
      
      return referral_idslevel;
}


