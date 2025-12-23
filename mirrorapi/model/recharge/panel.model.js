// Define the Countries model
const { Sequelize, Model, DataTypes, Op, sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes, Model) => {

    class panel extends Model {
        static async getAllData(param=null) {
            let cashback = '';
            // if(param !=null)
            // {
            //   cashback = {
            //     'is_cashback': param
            //   }
            // }
            try {
              const result = await this.findAll({
                  where: {
                    status: 1,
                  },
                  order: [['priority', 'ASC']]
                });
                return result;
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
          }
          
          static async getDataAll() {
            try {
              const result = await this.findAll({
                attributes: [
                    'id',
                    'service_name',
                    'short_name',
                    'status',
                    'priority',
                    'is_cashback',
                    [Sequelize.fn('date_format', Sequelize.col('created_on'), '%d-%m-%Y %H:%i:%s'), 'created_on'],
                    [Sequelize.fn('date_format', Sequelize.col('modified_on'), '%d-%m-%Y %H:%i:%s'), 'modified_on']
                ],
                  order: [['priority', 'ASC']]
                });
                return result;
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
        }

        static async getData(panel_id) {
          try {
            const result = await this.findOne({
              attributes: [
                  'id',
                  'service_name',
                  'short_name',
                  'status',
                  'priority',
                  'is_cashback',
                  [Sequelize.fn('date_format', Sequelize.col('created_on'), '%d-%m-%Y %H:%i:%s'), 'created_on'],
                  [Sequelize.fn('date_format', Sequelize.col('modified_on'), '%d-%m-%Y %H:%i:%s'), 'modified_on']
              ],
                where: {
                  id: panel_id,
                },
                order: [['priority', 'ASC']]
              });
              return result;
          } catch (error) {
              console.error('Error:', error);
              throw error;
          }
        }
        
        static async getDataPanel(panel_id) {
          try {
            const result = await this.findOne({
                where: {
                  id: panel_id
                }
              });
              return result;
          } catch (error) {
              console.error('Error:', error);
              throw error;
          }
        }
    }


    panel.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		  primaryKey: true,
		  autoIncrement: true
        },
        service_name:{
            type: DataTypes.STRING,
            allowNull: false
        },
        service_url: {
              type: DataTypes.STRING,
              allowNull: false
              },
        callback_url: {
              type: DataTypes.STRING,
              allowNull: false
          },
        status_code: {
              type: DataTypes.STRING,
              allowNull: false
          },
        error_message: {
              type: DataTypes.STRING,
              allowNull: false
          }, 
        created_on: {
          type: DataTypes.DATE,
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
            type: DataTypes.DATE,
            allowNull: true
        },
        deleted_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        priority: {
          type: DataTypes.INTEGER,
          allowNull: true
        },   
        status: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        excutable_fun: {
          type: DataTypes.STRING,
          allowNull: true
        },
        is_cashback: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
  
      },
      {
        sequelize, 
        modelName: 'panel',
        tableName: 'mst_recharge_panel', // specify table name here
        timestamps: false
      });
      
      return panel;
}


