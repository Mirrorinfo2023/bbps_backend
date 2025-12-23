const { connect } = require('../../config/db.config');
const { sequelize, DataTypes } = require('sequelize');
const fs = require('fs');

class cronJobChangeRechargePriority {
     db = {};

    constructor() {
 
        this.logFilePath = 'cron.log';
        this.db = connect();
    }
    
    async priorityJob() {
        const setting = await this.db.setting.getData(["recharge_panel_cron"]);
        
        const updatePriorityQuery = `
            UPDATE mst_recharge_panel
            SET priority = 
            CASE 
                WHEN priority = 4 THEN 1
                ELSE (priority+1)
            END;
        `;

        try {
            if(setting.recharge_panel_cron == 1)
            {
                const result = await this.db.sequelize.query(updatePriorityQuery);
                console.log('Priorities updated successfully.');
            }else{
                console.log('Priorities updated is stoped.');
            }
        } catch (error) {
            console.error('Error updating priorities:', error);
        }        
    }

    // async priorityJob() {
        
    //     const updatePriorityQuery = `
    //         UPDATE mst_recharge_panel
    //         SET priority = 
    //         CASE 
    //             WHEN priority = 1 THEN 4
    //             WHEN priority = 2 THEN 3
    //             WHEN priority = 3 THEN 2
    //             WHEN priority = 4 THEN 1
    //             ELSE priority
    //         END;
    //     `;

    //     try {
    //         const result = await this.db.sequelize.query(updatePriorityQuery);
    //         console.log('Priorities updated successfully.');
    //     } catch (error) {
    //         console.error('Error updating priorities:', error);
    //     }        
    // }
}

module.exports = new cronJobChangeRechargePriority();
