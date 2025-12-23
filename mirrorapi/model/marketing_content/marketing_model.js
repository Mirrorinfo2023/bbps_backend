
const { Sequelize, Model, DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    class MarketingContent extends Model {
        static async insertData(data) {
            try {
                return await this.create(data);
            } catch (error) {
                console.error('Error inserting data:', error);
                throw error;
            }
        }

        static async getData(attributes, whereClause) {
            try {
                const fixedCondition = { status: 1 };

                const result = await this.findAll({
                    attributes: [
                        ...attributes,
                        [Sequelize.fn('MAX', Sequelize.col('created_on')), 'max_created_on']
                    ],
                    where: { ...fixedCondition, ...whereClause },
                    group: attributes,
                    order: [['max_created_on', 'DESC']],
                    limit: 8
                });

                return result;
            } catch (error) {
                console.error('Error fetching data:', error);
                throw error;
            }
        }
    }

    MarketingContent.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        body: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 1
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false  // email, whatsapp, sms
        },
        templateType: {
            type: DataTypes.STRING,
            allowNull: false  // login, register, kyc, etc.
        },
        created_on: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: Sequelize.NOW
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'marketing_content',
        tableName: 'tbl_marketing_content',
        timestamps: false
    });

    return MarketingContent;
};
