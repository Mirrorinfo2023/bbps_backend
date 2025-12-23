const { connect } = require('../../config/db.config');
const utility = require('../../utility/whatsapp.utility')
const initializeRedis = require('../../../redis');
const redisClient = initializeRedis();

class AdminController {
    db = {};

    constructor() {
        this.db = connect();
    }

    getDashboardData = async (req, res) => {
        try {
            const sequelize = this.db.sequelize;

            //User stats: total, active, inactive, hold, today/week/month joined
            const [[userStats]] = await sequelize.query(`
            SELECT 
                COUNT(*) AS total_users,
                SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) AS active_users,
                SUM(CASE WHEN status = 0 THEN 1 ELSE 0 END) AS inactive_users,
                SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) AS hold_users,
                SUM(CASE WHEN DATE(created_on) = CURDATE() THEN 1 ELSE 0 END) AS today_joined,
                SUM(CASE WHEN YEARWEEK(created_on,1) = YEARWEEK(CURDATE(),1) THEN 1 ELSE 0 END) AS week_joined,
                SUM(CASE WHEN YEAR(created_on) = YEAR(CURDATE()) AND MONTH(created_on) = MONTH(CURDATE()) THEN 1 ELSE 0 END) AS month_joined
            FROM tbl_app_users;
        `);

            //Latest 5 users
            const [latestUsers] = await sequelize.query(`
            SELECT DATE(created_on) AS date, 
                   CONCAT(first_name, ' ', last_name) AS name, 
                   mobile, 
                   circle, 
                   referred_by AS refer_by
            FROM tbl_app_users
            ORDER BY created_on DESC
            LIMIT 5;
        `);

            //User join graph (last 7 days)
            const [userGraph] = await sequelize.query(`
            SELECT DATE(created_on) AS join_date, COUNT(*) AS user_count
            FROM tbl_app_users
            WHERE created_on >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY DATE(created_on)
            ORDER BY join_date ASC;
        `);

            //Investment graph (last 7 days)
            const [investmentGraph] = await sequelize.query(`
            SELECT DATE(p.created_on) AS invest_date, SUM(p.amount) AS total_investment
            FROM tbl_plan_purchase p
            WHERE p.created_on >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY DATE(p.created_on)
            ORDER BY invest_date ASC;
        `);
            console.log("investmentGraph", investmentGraph)
            res.status(200).json({
                success: true,
                stats: userStats,
                latestUsers,
                userGraph,
                investmentGraph
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: "Server Error" });
        }
    };



    getLatestUsersByFilter = async (req, res) => {
        try {
            const sequelize = this.db.sequelize;
            const { filter } = req.query; // today | week | month

            let whereClause = "";

            if (filter === "today") {
                whereClause = "WHERE DATE(created_on) = CURDATE()";
            } else if (filter === "week") {
                whereClause = "WHERE YEARWEEK(created_on, 1) = YEARWEEK(CURDATE(), 1)";
            } else if (filter === "month") {
                whereClause = "WHERE YEAR(created_on) = YEAR(CURDATE()) AND MONTH(created_on) = MONTH(CURDATE())";
            }

            const [filteredUsers] = await sequelize.query(`
            SELECT DATE(created_on) AS date, 
                   CONCAT(first_name, ' ', last_name) AS name, 
                   mobile, 
                   circle, 
                   referred_by AS refer_by
            FROM tbl_app_users
            ${whereClause}
            ORDER BY created_on DESC
            LIMIT 5
        `);

            res.status(200).json({ success: true, users: filteredUsers });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: "Server Error" });
        }
    }

    /**
     * Get Prime Users by Cycle
     * Cycles:
     *  - 5th Cycle  => day 26–31 OR 1–5
     *  - 15th Cycle => day 6–15
     *  - 25th Cycle => day 16–25
     */
    getPrimeUsersByCycle = async (req, res) => {
        try {
            const sequelize = this.db.sequelize;
            const { cycle } = req.query; // 5 | 15 | 25

            if (!cycle) {
                return res.status(400).json({
                    success: false,
                    message: "Cycle parameter is required (5, 15, 25)",
                });
            }

            let whereClause = `WHERE is_prime = 1`;
            if (cycle === "5") {
                whereClause += ` AND (DAY(created_on) BETWEEN 26 AND 31 OR DAY(created_on) BETWEEN 1 AND 5)`;
            } else if (cycle === "15") {
                whereClause += ` AND DAY(created_on) BETWEEN 6 AND 15`;
            } else if (cycle === "25") {
                whereClause += ` AND DAY(created_on) BETWEEN 16 AND 25`;
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Invalid cycle. Use 5, 15, or 25",
                });
            }

            const [primeUsers] = await sequelize.query(`
                SELECT 
                    id,
                    CONCAT(first_name, ' ', last_name) AS name,
                    email,
                    mobile,
                    circle,
                    referred_by AS refer_by,
                    plan_name,
                    created_on
                FROM view_user_details
                ${whereClause}
                ORDER BY created_on DESC
            `);
            res.status(200).json({
                success: true,
                cycle,
                count: primeUsers.length,
                users: primeUsers,
            });
        } catch (err) {
            console.error("Error fetching prime users by cycle:", err);
            res.status(500).json({ success: false, message: "Server Error" });
        }
    };

    // getProfitReturnReport = async (req, res) => {
    //     try {
    //         const sequelize = this.db.sequelize;

    //         // Get pagination from request body (optional)
    //         const { offset, limit } = req.body; // e.g., { offset: 0, limit: 50 }

    //         // Build LIMIT clause dynamically
    //         let limitClause = '';
    //         if (typeof offset !== 'undefined' && typeof limit !== 'undefined') {
    //             limitClause = `LIMIT ${parseInt(offset)}, ${parseInt(limit)}`;
    //         }

    //         const [reportData] = await sequelize.query(`
    //         SELECT 
    //             u.id AS user_id,
    //             CONCAT(u.first_name, ' ', u.last_name) AS user_name,
    //             u.mlm_id AS mr_id,  
    //             u.mobile,
    //             u.email,
    //             DATE(u.created_on) AS registration_date,
    //             DATE(p.created_on) AS investment_date,
    //             p.amount AS investment_amount,

    //             COALESCE((
    //                 SELECT SUM(t1.credit)
    //                 FROM trans_referral_income t1
    //                 WHERE t1.user_id = u.id
    //                   AND t1.tran_for IN ('Return','Income')
    //                   AND YEAR(t1.created_on) = YEAR(CURDATE())
    //                   AND MONTH(t1.created_on) = MONTH(CURDATE())
    //             ),0) AS this_month_return,

    //             COALESCE((
    //                 SELECT SUM(t2.credit)
    //                 FROM trans_referral_income t2
    //                 WHERE t2.sender_id = u.id
    //                   AND t2.tran_for IN ('Income')
    //                   AND YEAR(t2.created_on) = YEAR(CURDATE())
    //                   AND MONTH(t2.created_on) = MONTH(CURDATE())
    //             ),0) AS month_team_earning,

    //             COALESCE((
    //                 SELECT SUM(t3.credit)
    //                 FROM trans_referral_income t3
    //                 WHERE t3.user_id = u.id
    //                   AND t3.tran_for IN ('Return','Income')
    //             ),0) AS total_return,

    //             COALESCE((
    //                 SELECT SUM(t4.credit)
    //                 FROM trans_referral_income t4
    //                 WHERE t4.sender_id = u.id
    //                   AND t4.tran_for IN ('Income')
    //             ),0) AS total_team_earning,

    //             COALESCE((
    //                 SELECT SUM(t5.credit)
    //                 FROM trans_referral_income t5
    //                 WHERE t5.user_id = u.id
    //                   AND t5.tran_for IN ('Return','Income')
    //                   AND DATE(t5.created_on) = CURDATE()
    //             ),0) AS today_earning,

    //             COALESCE(p.amount,0) - COALESCE((
    //                 SELECT SUM(t6.credit)
    //                 FROM trans_referral_income t6
    //                 WHERE t6.user_id = u.id
    //                   AND t6.tran_for IN ('Return','Income')
    //             ),0) AS total_remaining,

    //             CONCAT('Plan ', p.plan_id) AS user_in,

    //             CASE 
    //                 WHEN (DAY(u.created_on) BETWEEN 26 AND 31 OR DAY(u.created_on) BETWEEN 1 AND 5) THEN '5'
    //                 WHEN DAY(u.created_on) BETWEEN 6 AND 15 THEN '15'
    //                 WHEN DAY(u.created_on) BETWEEN 16 AND 25 THEN '25'
    //             END AS payout_cycle,

    //             CASE WHEN p.status = 1 THEN 'Active' ELSE 'Inactive' END AS status

    //         FROM tbl_app_users u
    //         LEFT JOIN tbl_plan_purchase p ON u.id = p.user_id
    //         WHERE u.status = 1
    //         ORDER BY u.created_on DESC
    //         ${limitClause};
    //     `);

    //         return res.status(200).json({
    //             success: true,
    //             count: reportData.length,
    //             report: reportData
    //         });

    //     } catch (err) {
    //         console.error("Error generating profit return report:", err);
    //         return res.status(500).json({ success: false, message: "Server Error" });
    //     }
    // };

          

   getProfitReturnReport = async (req, res) => {
    try {
        const sequelize = this.db.sequelize;
        const { offset, limit } = req.body;

        const cacheKey = 'profit_return_report_all';

        // Check cache if no pagination
        if (typeof offset === 'undefined' || typeof limit === 'undefined') {
            const cachedData = await redisClient.get(cacheKey);
            if (cachedData) {
                console.log("Fetching full report from Redis");
                const parsed = JSON.parse(cachedData);
                return res.status(200).json({
                    success: true,
                    count: parsed.length,
                    report: parsed
                });
            }
        }

        // Pagination clause
        let limitClause = '';
        if (typeof offset !== 'undefined' && typeof limit !== 'undefined') {
            limitClause = `LIMIT ${parseInt(offset)}, ${parseInt(limit)}`;
        }

        // Step 1: Fetch users + plan info
        const [users] = await sequelize.query(`
            SELECT 
                u.id AS user_id,
                CONCAT(u.first_name, ' ', u.last_name) AS user_name,
                u.mlm_id AS mr_id,
                u.mobile,
                u.email,
                DATE(u.created_on) AS registration_date,
                DATE(p.created_on) AS investment_date,
                p.amount AS investment_amount,
                CONCAT('Plan ', p.plan_id) AS user_in,
                CASE 
                    WHEN (DAY(u.created_on) BETWEEN 26 AND 31 OR DAY(u.created_on) BETWEEN 1 AND 5) THEN '5'
                    WHEN DAY(u.created_on) BETWEEN 6 AND 15 THEN '15'
                    WHEN DAY(u.created_on) BETWEEN 16 AND 25 THEN '25'
                END AS payout_cycle,
                CASE WHEN p.status = 1 THEN 'Active' ELSE 'Inactive' END AS status
            FROM tbl_app_users u
            LEFT JOIN tbl_plan_purchase p ON u.id = p.user_id
            WHERE u.status = 1
            ORDER BY u.created_on DESC
            ${limitClause};
        `);

        if (users.length === 0) {
            return res.status(200).json({ success: true, count: 0, report: [] });
        }

        const userIds = users.map(u => u.user_id);

        // Step 2: Fetch transactions (only raw data, no sums)
        const [transactions] = await sequelize.query(`
            SELECT 
                t.id,
                t.user_id,
                t.sender_id,
                t.tran_for,
                t.credit,
                DATE(t.created_on) as created_on
            FROM trans_referral_income t
            WHERE t.user_id IN (${userIds.join(",")})
               OR t.sender_id IN (${userIds.join(",")});
        `);

        // Step 3: Calculate aggregates in Node.js
        const today = new Date().toISOString().slice(0, 10);
        const thisMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

        const txnMap = {};
        transactions.forEach(tx => {
            const uid = tx.user_id; // main user id
            if (!txnMap[uid]) {
                txnMap[uid] = {
                    total_return: 0,
                    total_team_earning: 0,
                    today_earning: 0,
                    this_month_return: 0,
                    month_team_earning: 0
                };
            }

            // --- Calculations ---
            if (["Return", "Income"].includes(tx.tran_for)) {
                txnMap[uid].total_return += tx.credit;

                if (tx.created_on === today) {
                    txnMap[uid].today_earning += tx.credit;
                }

                if (tx.created_on.startsWith(thisMonth)) {
                    txnMap[uid].this_month_return += tx.credit;
                }
            }

            if (tx.sender_id === uid && tx.tran_for === "Income") {
                txnMap[uid].total_team_earning += tx.credit;

                if (tx.created_on.startsWith(thisMonth)) {
                    txnMap[uid].month_team_earning += tx.credit;
                }
            }
        });

        // Step 4: Merge into report
        const report = users.map(u => {
            const agg = txnMap[u.user_id] || {};
            return {
                ...u,
                today_earning: agg.today_earning || 0,
                this_month_return: agg.this_month_return || 0,
                month_team_earning: agg.month_team_earning || 0,
                total_return: agg.total_return || 0,
                total_team_earning: agg.total_team_earning || 0,
                total_remaining: (u.investment_amount || 0) - (agg.total_return || 0)
            };
        });

        // Step 5: Cache if no pagination
        if (typeof offset === 'undefined' || typeof limit === 'undefined') {
            await redisClient.set(cacheKey, JSON.stringify(report), 'EX', 86400);
            console.log("Stored full report in Redis");
        }

        return res.status(200).json({
            success: true,
            count: report.length,
            report
        });

    } catch (err) {
        console.error("Error generating profit return report:", err);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};



}

module.exports = new AdminController();
