// models/PrimeUserRequest.js
module.exports = (sequelize, DataTypes, Model) => {
  class PrimeUserRequest extends Model {
    static async insertData(data) {
      try {
        const result = await this.create(data);
        return result;
      } catch (error) {
        console.error('Error inserting PrimeUserRequest:', error);
        throw error;
      }
    }
  }

  PrimeUserRequest.init(
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      sender_user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      plan_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      remark: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      utr_id: {
        type: DataTypes.JSON, // multiple UTR numbers
        allowNull: true,
      },
      images: {
        type: DataTypes.JSON, // multiple file paths for proofs
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'pending',
      },
      reason: {
        type: DataTypes.TEXT, // rejection reason if needed
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'PrimeUserRequest',
      tableName: 'tbl_prime_user_request',
      timestamps: true, // createdAt, updatedAt
    }
  );

  return PrimeUserRequest;
};
