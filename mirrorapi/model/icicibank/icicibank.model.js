// Define the ICICI Bank payment request model
module.exports = (sequelize, DataTypes, Model) => {

    class IciciBankRequest extends Model {

        static async insertData(data) {
            try {
                return await this.create(data);
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
        }

        static async getData(whereParam) {
            try {
                return await this.findOne({
                    where: { ...whereParam }
                });
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
        }

        static async UpdateData(data, whereClause) {
            try {
                return await this.update(data, {
                    where: { ...whereClause }
                });
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
        }
    }

    IciciBankRequest.init({

        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },

        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },

        transaction_id: {
            type: DataTypes.STRING,
            allowNull: true
        },

        // ICICI specific fields
        merchant_txn_no: {
            type: DataTypes.STRING,
            allowNull: false
        },

        icici_tran_ctx: {
            type: DataTypes.STRING,
            allowNull: true
        },

        aggregator_id: {
            type: DataTypes.STRING,
            allowNull: false
        },

        order_date: {
            type: DataTypes.DATE,
            allowNull: false
        },

        order_amount: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },

        redirect_url: {
            type: DataTypes.STRING,
            allowNull: false
        },

        status: {
            type: DataTypes.STRING,
            allowNull: true
        },

        order_response: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        created_on: {
            type: DataTypes.DATE,
            allowNull: true
        },

        // Payment completion details
        txn_id: {
            type: DataTypes.STRING,
            allowNull: true
        },

        transaction_date: {
            type: DataTypes.DATE,
            allowNull: true
        },

        payment_amount: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },

        bank_ref_no: {
            type: DataTypes.STRING,
            allowNull: true
        },

        payment_method_type: {
            type: DataTypes.STRING,
            allowNull: true
        },

        transaction_error_desc: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        response_json: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        payment_status: {
            type: DataTypes.INTEGER,
            allowNull: true
            /*
              0 = initiated
              1 = success
              2 = failed
              3 = pending
            */
        }

    },
        {
            sequelize,
            modelName: 'IciciBankRequest',
            tableName: 'tbl_icici_bank_request',
            timestamps: false
        });

    return IciciBankRequest;
};
