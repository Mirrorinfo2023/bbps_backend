
const { Sequelize, Model, DataTypes, Op, sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes, Model) => {

  class kyc extends Model {
    static async insertData(data) {
      try {
        const result = await this.create(data);
        return result;
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
    }

    static async updateData(data, whereClause) {
      try {
        const updateRecharge = await this.update(data, {
          where: whereClause
        });
        if (updateRecharge) {
          return { error: 0, message: 'Updated', result: updateRecharge.id };
        } else {
          return { error: 1, message: 'Not update', result: '' };
        }

      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
    }

    static async UpdateData(data, whereClause) {
      try {
        const result = await this.update(data, {
          where: whereClause
        });
        return result;
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
    }


    static async getAllData(whereCondition) {
      try {
        const result = await this.findAll({


          attributes: [
            'id',
            'user_id',
            'pan_number',
            'aadhar_number',
            'aadharImage',
            'status',
            'panImage',
            'checkbookImage',
            'account_number',
            'account_holder',
            'ifsc_code',
            'nominee_name',
            'nominee_relation',
            'aadharBackImage',
            'bank_name',
            'address',
            //   'created_on',
            'rejection_reason',


            [Sequelize.fn('date_format', Sequelize.col('modified_on'), '%d-%m-%Y %H:%i:%s'), 'modified_on'],
            [Sequelize.fn('date_format', Sequelize.col('created_on'), '%d-%m-%Y %H:%i:%s'), 'created_on'],
          ],
          where: whereCondition,
          order: [['created_on', 'DESC'], ['status', 'ASC']],
        });
        return result;
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
    }



    static async getKycData(whereClause) {
      try {
        const result = await this.findOne({

          attributes: [
            'user_id',
            'pan_number',
            'aadhar_number',
            'aadharImage',
            'status',
            'panImage',
            'checkbookImage',
            'account_number',
            'account_holder',
            'ifsc_code',
            'nominee_name',
            'nominee_relation',
            'aadharBackImage',
            'address',
            'rejection_reason',
            'bank_name',

            [Sequelize.fn('date_format', Sequelize.col('created_on'), '%a, %e %M %Y %H:%i:%s'), 'created_on'],
          ],

          where: whereClause,
          order: [['id', 'DESC']]

        });
        return result;
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
    }



  }

  kyc.init({
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
    pan_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    aadhar_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    account_number: {
      type: DataTypes.STRING,
      allowNull: false
    },

    account_holder: {
      type: DataTypes.STRING,
      allowNull: false
    },
    bank_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ifsc_code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    account_holder: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nominee_name: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    nominee_relation: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    aadharImage: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    checkbookImage: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    modified_on: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    },
    modified_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    deleted_on: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    },
    deleted_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    aadharBackImage: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    panImage: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    rejection_reason: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },

  },
    {
      sequelize,
      modelName: 'kyc',
      tableName: 'tbl_kyc', // specify table name here
      timestamps: false
    });

  return kyc;
}


