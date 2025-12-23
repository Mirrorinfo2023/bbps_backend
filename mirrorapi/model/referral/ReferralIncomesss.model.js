const { Sequelize, Model, DataTypes, Op, sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes, Model) => {

    class ReferralIncomesss extends Model {
        
     static async getCount(user_id,sub_type,details) {
        try {
          const result = await this.count({
            where: {user_id,
                 tran_for: 'Royality',
                 sub_type:sub_type,
                 details:details
            }
          });
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      
      static async insert(data) {
        try {
          const result = await this.create(data);
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }

      static async getIncomeBalance(user_id) {
        const credit_amount = await this.findOne({
          attributes: [
            [sequelize.fn('SUM', sequelize.col('credit')), 'amount']
          ],
          where: {
            user_id: user_id,
            status: '1'
          }
        });
    
        const debit_amount = await this.findOne({
          attributes: [
            [sequelize.fn('SUM', sequelize.col('debit')), 'amount']
          ],
          where: {
            user_id: user_id,
            status: '1'
          }
        });
        
        let cr_amount=0;
        let dr_amount =0;
        
        if(credit_amount && credit_amount.dataValues.amount !== null 
        && credit_amount.dataValues.amount>=0){
            
            cr_amount = credit_amount.dataValues.amount;
        }
        
        if(debit_amount && debit_amount.dataValues.amount !== null 
        && debit_amount.dataValues.amount>=0){
            
            dr_amount = debit_amount.dataValues.amount;
        }
        
         
        return cr_amount-dr_amount;
      }



static async getTotalCredit(user_id, prime_ids=null) {
  const result = await this.findOne({
    attributes: [
      [sequelize.fn('SUM', sequelize.col('credit')), 'credit_amount']
    ],
    where: {
      user_id,
      status: '1'
    },
    raw: true
  });

  return result?.credit_amount || 0;
}

//,plan_id: { [Op.in]: prime_ids }


 static async getDailyBonusBalance(user_id,prime_id) {
  const creditRows = await this.findAll({
    attributes: [
      'plan_id',
      [sequelize.fn('SUM', sequelize.col('credit')), 'credit_amount']
    ],
    where: {
      user_id: user_id,
      status: '1',
      sub_type: 'Daily Bonus Income',
		plan_id: { [Op.in]: prime_id }
    },
    group: ['plan_id']
  });

  const debitRows = await this.findAll({
    attributes: [
      'plan_id',
      [sequelize.fn('SUM', sequelize.col('debit')), 'debit_amount']
    ],
    where: {
      user_id: user_id,
      status: '1',
      sub_type: 'Daily Bonus Income',
     plan_id: { [Op.in]: prime_id }
    },
    group: ['plan_id']
  });

  const creditMap = {};
  for (const row of creditRows) {
    creditMap[row.plan_id] = parseFloat(row.dataValues.credit_amount || 0);
  }

  const debitMap = {};
  for (const row of debitRows) {
    debitMap[row.plan_id] = parseFloat(row.dataValues.debit_amount || 0);
  }

  const balances = {};

  const allPlanIds = new Set([
    ...Object.keys(creditMap),
    ...Object.keys(debitMap)
  ]);

  for (const planId of allPlanIds) {
    const cr = creditMap[planId] || 0;
    const dr = debitMap[planId] || 0;
    balances[planId] = cr - dr;
  }

  return balances; // e.g., { '1': 100, '2': 50, ... }
}


static async getReferralBonusBalance(user_id,prime_id) {
  // Get total credits grouped by plan_id
  const creditRows = await this.findAll({
    attributes: [
      'plan_id',
      [sequelize.fn('SUM', sequelize.col('credit')), 'credit_amount']
    ],
    where: {
      user_id: user_id,
      status: '1',
      sub_type: {
        [Op.or]: ['Daily Repurchase Bonus']
      },
	plan_id: { [Op.in]: prime_id }
    },
    group: ['plan_id']
  });

  // Get total debits grouped by plan_id
  const debitRows = await this.findAll({
    attributes: [
      'plan_id',
      [sequelize.fn('SUM', sequelize.col('debit')), 'debit_amount']
    ],
    where: {
      user_id: user_id,
      status: '1',
      sub_type: {
        [Op.or]: ['Daily Repurchase Bonus', 'Redeem']
      },
	 plan_id: { [Op.in]: prime_id }
    },
    group: ['plan_id']
  });

  // Convert to lookup maps
  const creditMap = {};
  for (const row of creditRows) {
    creditMap[row.plan_id] = parseFloat(row.dataValues.credit_amount || 0);
  }

  const debitMap = {};
  for (const row of debitRows) {
    debitMap[row.plan_id] = parseFloat(row.dataValues.debit_amount || 0);
  }

  // Merge both maps and compute balances
  const balances = {};
  const allPlanIds = new Set([
    ...Object.keys(creditMap),
    ...Object.keys(debitMap)
  ]);

  for (const planId of allPlanIds) {
    const cr = creditMap[planId] || 0;
    const dr = debitMap[planId] || 0;
    balances[planId] = cr - dr;
  }

  return balances; // { plan_id: balance }
}




static async getBonusBalance(user_id,prime_id) {
  // Get total credits grouped by plan_id
  const creditRows = await this.findAll({
    attributes: [
      'plan_id',
      [sequelize.fn('SUM', sequelize.col('credit')), 'credit_amount']
    ],
    where: {
      user_id: user_id,
      status: '1',
      sub_type: {
        [Op.or]: ['Bonus']
      },
	plan_id: { [Op.in]: prime_id }
    },
    group: ['plan_id']
  });

  // Get total debits grouped by plan_id
  const debitRows = await this.findAll({
    attributes: [
      'plan_id',
      [sequelize.fn('SUM', sequelize.col('debit')), 'debit_amount']
    ],
    where: {
      user_id: user_id,
      status: '1',
      sub_type: {
        [Op.or]: ['Bonus']
      },
	 plan_id: { [Op.in]: prime_id }
    },
    group: ['plan_id']
  });

  // Convert to lookup maps
  const creditMap = {};
  for (const row of creditRows) {
    creditMap[row.plan_id] = parseFloat(row.dataValues.credit_amount || 0);
  }

  const debitMap = {};
  for (const row of debitRows) {
    debitMap[row.plan_id] = parseFloat(row.dataValues.debit_amount || 0);
  }

  // Merge both maps and compute balances
  const balances = {};
  const allPlanIds = new Set([
    ...Object.keys(creditMap),
    ...Object.keys(debitMap)
  ]);

  for (const planId of allPlanIds) {
    const cr = creditMap[planId] || 0;
    const dr = debitMap[planId] || 0;
    balances[planId] = cr - dr;
  }

  return balances; // { plan_id: balance }
}

      
        
      static async getEarningAmount(whereCondition) {
        const credit_amount = await this.findOne({
          attributes: [
            [sequelize.fn('SUM', sequelize.col('credit')), 'amount']
          ],
          where: whereCondition
        });
        return credit_amount.dataValues.amount;
      }
      
      
      static async getTotalIncome(user_id) {
        const credit_amount = await this.findOne({
          attributes: [
            [sequelize.fn('SUM', sequelize.col('credit')), 'amount']
          ],
          where: {
            user_id: user_id,
            status: '1'
          }
        });

        let cr_amount=0;
        if(credit_amount && credit_amount.dataValues.amount !== null 
          && credit_amount.dataValues.amount>=0){
              
              cr_amount = credit_amount.dataValues.amount;
          }
        return cr_amount;
      }


      static async getTodayIncome(user_id) {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);
        
        const credit_amount = await this.findOne({
          attributes: [
            [sequelize.fn('SUM', sequelize.col('credit')), 'amount']
          ],
          where: {
            user_id: user_id,
            status: '1',
            created_on : {
              [Op.between]: [startOfToday, endOfToday]
            },
          }
        });

        let cr_amount=0;
        if(credit_amount && credit_amount.dataValues.amount !== null 
          && credit_amount.dataValues.amount>=0){
              
              cr_amount = credit_amount.dataValues.amount;
          }
        return cr_amount;
      }
      

      static async getLastIncomeclosingBalance(user_id)
      {
           try {
                const closingBalance = await this.findOne({
                    attributes: ['closing_balance'],
                    where: {
                        user_id: user_id,
                        status: '1'
                    },
                    order: [['id', 'DESC']],
                    raw: true,
                    nest: true
                });
        
                // If closingBalance is null or undefined, return zero
                return closingBalance ? closingBalance.closing_balance : 0;
            } catch (error) {
                console.error('Error in getLastclosingBalance:', error);
                throw error; 
            }
      }
      
      static async getTotalLevelIncome(level)
      {
           try {
               
                const TotalLevelIncome = await this.findAll({
                            attributes: ['user_id', [Sequelize.fn('SUM', Sequelize.col('credit')), 'total_income']],
                                  where: {
                                    level,
                                    type:'Credit',
                                    tran_for:'Income',
                                    status: '1'
                                  },
                                  group: ['user_id'],
                                  order: [['user_id', 'ASC']],
                                  raw: true,
                                  nest: true
                                });
        
                return TotalLevelIncome;
                
            } catch (error) {
                console.error('Error in TotalLevelIncome:', error);
                throw error; 
            }
      }
      
      
        static async getsenderUserLevel(sender_id, plan_id) {
            try {
                const results = await this.findAll({
                    attributes: ['user_id'],
                    where: { sender_id, plan_id },
                    raw: true,
                });
                return results.map(row => row.user_id); // Map user IDs directly
            } catch (error) {
                console.error('Error in TotalUserLevel:', error);
                throw error;
            }
        }

      
      
    static async getSilverSumAmount(CurrentMonth,year) {
        
        try {
            const silverSum = await this.sum('credit', {
                where: {
                    sub_type: 'Silver ( Silver Income ) ',
                    tran_for:'Royality',
                    details: {
                        [Sequelize.Op.like]: `%${CurrentMonth} ${year}%`,
                    },
                },
            });
    
            return silverSum?silverSum:0;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
        
        
    }
    
    static async getSilverSumAmount(CurrentMonth,year) {
        
        try {
            const silverSum = await this.sum('credit', {
                where: {
                    sub_type: 'Silver ( Silver Income ) ',
                    tran_for:'Royality',
                    details: {
                        [Sequelize.Op.like]: `%${CurrentMonth} ${year}%`,
                    },
                },
            });
    
            return silverSum?silverSum:0;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
        
        
    }
    
    static async getMobilerSumAmount(CurrentMonth,year) {
        
        try {
            const silverSum = await this.sum('credit', {
                where: {
                  
                      [Op.or]: [
                    { sub_type: 'Gold ( Mobile Fund ) ' },
                    { sub_type: 'Royality' }
                   ],
                    tran_for:'Royality',
                    details: {
                        [Sequelize.Op.like]: `%${CurrentMonth} ${year} Mobile Fund %`,
                    },
                },
            });
    
            return silverSum?silverSum:0;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
        
        
    }
    
    
    
    static async getGoldSumAmount(CurrentMonth,year) {
        
        try {
            const GoldSum = await this.sum('credit', {
                where: {
                    sub_type: 'Gold ( Gold Income ) ',
                    tran_for:'Royality',
                    details: {
                        [Sequelize.Op.like]: `%${CurrentMonth} ${year}%`,
                    },
                },
            });
    
            return GoldSum?GoldSum:0;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
        
        
    }
    
    
    
     static async getPlatinumSumAmount(CurrentMonth,year) {
        
        try {
            const PlatinumSum = await this.sum('credit', {
                where: {
                    sub_type: 'Platinum ( Platinum Income ) ',
                    tran_for:'Royality',
                    details: {
                        [Sequelize.Op.like]: `%${CurrentMonth} ${year}%`,
                    },
                },
            });
    
            return PlatinumSum?PlatinumSum:0;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
        
        
    }
    
    
    
    static async getDiamondSumAmount(CurrentMonth,year) {
        
        try {
            const DiamondSum = await this.sum('credit', {
                where: {
                    sub_type: 'Diamond ( Diamond Income ) ',
                    tran_for:'Royality',
                    details: {
                        [Sequelize.Op.like]: `%${CurrentMonth} ${year}%`,
                    },
                },
            });
    
            return DiamondSum?DiamondSum:0;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
        
        
    }
    
    
    
    
    static async getCarFundSumAmount(CurrentMonth,year) {
        
        try {
            const CarFundSum = await this.sum('credit', {
                where: {
                   
                     [Op.or]: [
                    { sub_type: 'Gold ( Car Fund Income ) ' },
                    { sub_type: 'Royality' }
                   ],
                    tran_for:'Royality',
                    details: {
                        [Sequelize.Op.like]: `%${CurrentMonth} ${year} Car Fund %`,
                    },
                },
            });
    
            return CarFundSum?CarFundSum:0;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
        
        
    }
    
   
    
    
    static async getHouseFundSumAmount(CurrentMonth,year) {
        
        try {
            const HouseFundSum = await this.sum('credit', {
                where: {
                   
                    [Op.or]: [
                    { sub_type: 'Platinum ( House Fund Income ) ' },
                    { sub_type: 'Royality' }
                   ],
                    tran_for:'Royality',
                    details: {
                        [Sequelize.Op.like]: `%${CurrentMonth} ${year} House Fund %`,
                    },
                },
            });
    
            return HouseFundSum?HouseFundSum:0;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
        
        
    }
    
    
    static async getDoubleDiamondSumAmount(CurrentMonth,year) {
        
        try {
            const DoubleDiamondSum = await this.sum('credit', {
                where: {
                    sub_type: 'Double Diamond ( Double Diamond Income ) ',
                    tran_for:'Royality',
                    details: {
                        [Sequelize.Op.like]: `%${CurrentMonth} ${year}%`,
                    },
                },
            });
    
            return DoubleDiamondSum?DoubleDiamondSum:0;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
        
        
    }
    
    
     static async getTravelFundSumAmount(CurrentMonth,year) {
        
        try {
            const DoubleDiamondSum = await this.sum('credit', {
                where: {
                   
                      [Op.or]: [
                    { sub_type: 'Double Diamond ( Travel Fund Income ) ' },
                    { sub_type: 'Royality' }
                   ],
                    tran_for:'Royality',
                    details: {
                        [Sequelize.Op.like]: `%${CurrentMonth} ${year} Travel Fund %`,
                    },
                },
            });
    
            return DoubleDiamondSum?DoubleDiamondSum:0;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
        
        
    }
    
    
     static async getAmbassdorSumAmount(CurrentMonth,year) {
        
        try {
            const Ambassdor = await this.sum('credit', {
                where: {
                    sub_type: 'Ambassdor ( Ambassdor Income ) ',
                    tran_for:'Royality',
                    details: {
                        [Sequelize.Op.like]: `%${CurrentMonth} ${year}%`,
                    },
                },
            });
    
            return Ambassdor?Ambassdor:0;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
        
        
    }
    
    
     static async getCommunityFundSumAmount(CurrentMonth,year) {
        
        try {
            const CommunityFund = await this.sum('credit', {
                where: {
                   
                     [Op.or]: [
                    { sub_type: 'Double Diamond ( Community Fund Income ) ' },
                    { sub_type: 'Royality' }
                   ],
                    tran_for:'Royality',
                    details: {
                        [Sequelize.Op.like]: `%${CurrentMonth} ${year}  Community Fund %`,
                    },
                },
            });
    
            return CommunityFund?CommunityFund:0;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
        
        
    }
    
    
    
    static async getReferralDetailsCount(user_id, joinSql, whereClause) {
        
          const rawQuery = `SELECT 
                    count(u.mlm_id) as num_rows
                    from tbl_referral_idslevel l 
                    join tbl_app_users u on l.user_id=u.id
                    left join mst_cities  c  on u.city_id=c.id
                    ${joinSql}
                    where l.ref_userid=${user_id} and l.level=1 and l.status=1 and u.status=1  
                    ${whereClause}`;

          const teams = await sequelize.query(rawQuery, {
          type: sequelize.QueryTypes.SELECT,
          });
          
          return teams?teams[0].num_rows:0;
          
      }
     
    
        
        
    static async insert_income(transactionData)
    {
        
        
       /* const wallet = await this.findOne({
            where: {
                user_id: transactionData.user_id,
                env: transactionData.env,
                tran_for: 'income',
                status: 1,
            },
            order: [['id', 'DESC']],
            limit: 1,
        });

        const opening_balance = wallet ? wallet.closing_balance : 0;
        let credit = 0;
        let debit = 0;
        let closing_balance = 0;

        if (transactionData.type === 'Credit') {
            credit = transactionData.amount;
            closing_balance = parseFloat(opening_balance) + parseFloat(credit);
        }

        if (transactionData.type === 'Debit') {
            debit = transactionData.amount;
            closing_balance = parseFloat(opening_balance) - parseFloat(debit);
        }*/


        try {
            const newTransaction = await this.create({
                user_id: transactionData.user_id,
                transaction_id: transactionData.transaction_id,
                env: transactionData.env,
                type: transactionData.type,
                sub_type: transactionData.sub_type,
                tran_for: transactionData.tran_for,
                opening_balance:transactionData.opening_balance,
                credit:transactionData.credit,
                debit:transactionData.debit,
                closing_balance:transactionData.closing_balance,
                details:transactionData.details,
                sender_id:transactionData.sender_id,
                level:transactionData.level,
                plan_id:transactionData.plan_id,
                status: 1,
                created_by: transactionData.user_id,
            });
                if (newTransaction) {
                    
                        const createdId = newTransaction.id;
                        
                        return { error: 0, message: 'Transaction saved', createdId:createdId };
                        
                    } else {
                        return { error: 1, message: 'Unable to save transaction' };
                    }
        
        
            } catch (error) {
                console.error('Error inserting into the wallet:', error.message);
                throw error;
            }

        
        
       }
       
       
       static async checkIncomeBalance(user_id) {
        const credit_amount = await this.findOne({
          attributes: [
            [sequelize.fn('SUM', sequelize.col('credit')), 'amount']
          ],
          where: {
            user_id: user_id,
            status: '1'
          }
        });
    
        const debit_amount = await this.findOne({
          attributes: [
            [sequelize.fn('SUM', sequelize.col('debit')), 'amount']
          ],
          where: {
            user_id: user_id,
            status: '1'
          }
        });
        
        let cr_amount=0;
        let dr_amount =0;
        
        if(credit_amount && credit_amount.dataValues.amount !== null 
        && credit_amount.dataValues.amount>=0){
            
            cr_amount = credit_amount.dataValues.amount;
        }
        
        if(debit_amount && debit_amount.dataValues.amount !== null 
        && debit_amount.dataValues.amount>=0){
            
            dr_amount = debit_amount.dataValues.amount;
        }
        
         
        return cr_amount-dr_amount;
      }
      

    }

    ReferralIncomesss.init({
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
        transaction_id: {
              type: DataTypes.INTEGER,
              allowNull: false
              },
        env: {
              type: DataTypes.STRING,
              allowNull: false
          },
        type: {
              type: DataTypes.STRING,
              allowNull: false
          },
        sub_type: {
              type: DataTypes.STRING,
              allowNull: true
          },
        opening_balance: {
              type: DataTypes.DOUBLE,
              allowNull: false
          },
        credit: {
          type: DataTypes.DOUBLE,
          allowNull: false
          },
        debit: {
          type: DataTypes.DOUBLE,
          allowNull: false
          },
        closing_balance: {
          type: DataTypes.DOUBLE,
          allowNull: false
          },
        tran_for:{
            type: DataTypes.STRING,
            allowNull: false
        },
        status:{
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
        details:{
            type: DataTypes.STRING,
            allowNull: false
        },
        sender_id:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
         level:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
         plan_id:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        
        
        
  
      },
      {
        sequelize, 
        modelName: 'ReferralIncomesss',
        tableName: 'trans_referral_income_30725', // specify table name here
        timestamps: false
      });
      
      return ReferralIncomesss;
}


