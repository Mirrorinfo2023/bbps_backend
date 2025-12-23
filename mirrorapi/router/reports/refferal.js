const express = require('express');
const ReferralUserReport = require('../../controller/reports/ReferralUserReport.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');


const Refferal = express.Router();

const endpoints = {
    'prime-user-report': '970213a38c9fb83baa350755d2e83f79f1e20f5f',
    'prime-distribution-report': 'd64cbc0df7a77cb6bc035f5f615857719a98f2ad',
    'user-income-report': '407cdc812367385716bc5148740ab3889cd4ee39',
    'team-details': '2f01312cafbd54f54f71b56d3d03cbae1fc8cdf7',
    'team-level-details': '65e1bce665c5b66ff4076e963488b62999b44c16',
    'company-portfolio': '92ba6b72c22a4434a2c259c84a956435fa6fb21a',
    'target-royality-graph': 'f8d25582c395b3ec9ea97b352f77331b4d3dcb91',
    'total-rank-distribution': 'a0fa5da342840d6465d3bc39baae7ad9d2efbd91',
    'today-referral-detail': '6fb793f557894d6c34189849fa8abf6fc20c5750',
    'random-team-level-details': '97841e354e0da498f5c5792bf3f1be0e5d993d1f'
};


Refferal.post('/970213a38c9fb83baa350755d2e83f79f1e20f5f', authenticateJWT, logMiddleware, async (req, res) => {
    ReferralUserReport.primeUser(req.body, res)
        .then(data => res.json(data))
        .catch(error => {
            console.error('Error requesting Prime User Report:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

Refferal.post('/d64cbc0df7a77cb6bc035f5f615857719a98f2ad', authenticateJWT, logMiddleware, async (req, res) => {
    ReferralUserReport.primeIncomeDistribution(req.body, res)
        .then(data => res.json(data))
        .catch(error => {
            console.error('Error requesting Prime Distribution Report:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


Refferal.post('/407cdc812367385716bc5148740ab3889cd4ee39', authenticateJWT, logMiddleware, async (req, res) => {
    ReferralUserReport.userIncomeReport(req.body, res)
        .then(data => res.json(data))
        .catch(error => {
            console.error('Error requesting User Income Report:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

Refferal.post('/2f01312cafbd54f54f71b56d3d03cbae1fc8cdf7', authenticateJWT, logMiddleware, async (req, res) => {
    ReferralUserReport.team_details(req.body, res)
        .then(data => res.json(data))
        .catch(error => {
            console.error('Error requesting Team Detais:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

Refferal.post('/65e1bce665c5b66ff4076e963488b62999b44c16', authenticateJWT, logMiddleware, async (req, res) => {
    ReferralUserReport.team_level_details(req.body, res)
        .then(data => res.json(data))
        .catch(error => {
            console.error('Error requesting Team Level Details:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


Refferal.get('/92ba6b72c22a4434a2c259c84a956435fa6fb21a', authenticateJWT, logMiddleware, async (req, res) => {
    ReferralUserReport.companyportfolio(req.body, res)
        .then(data => res.json(data))
        .catch(error => {
            console.error('Error requesting company portfolio :', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

Refferal.post('/f8d25582c395b3ec9ea97b352f77331b4d3dcb91', authenticateJWT, logMiddleware, async (req, res) => {
    ReferralUserReport.userTargetRoyalityGraph(req.body, res)
        .then(data => res.json(data))
        .catch(error => {
            console.error('Error requesting Target Royality Graph:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

Refferal.post('/a0fa5da342840d6465d3bc39baae7ad9d2efbd91', authenticateJWT, logMiddleware, async (req, res) => {
    ReferralUserReport.TotalRankDistribution(req.body, res)
        .then(data => res.json(data))
        .catch(error => {
            console.error('Error requesting Total Rank Distribution:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


Refferal.post('/6fb793f557894d6c34189849fa8abf6fc20c5750', authenticateJWT, logMiddleware, async (req, res) => {
    ReferralUserReport.today_referral_detail(req.body, res).then(data => res.json(data));
});


Refferal.post('/97841e354e0da498f5c5792bf3f1be0e5d993d1f', authenticateJWT, logMiddleware, async (req, res) => {
    ReferralUserReport.random_team_level_details(req.body, res)
        .then(data => res.json(data))
        .catch(error => {
            console.error('Error requesting Team Level Details:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


Refferal.post('/prime-user-report', async (req, res) => {

    ReferralUserReport.primeUser(req.body, res);
});
Refferal.post('/prime-distribution-report', async (req, res) => {


    ReferralUserReport.primeIncomeDistribution(req.body, res);
});


Refferal.post('/user-income-report', async (req, res) => {

    ReferralUserReport.userIncomeReport(req.body, res);
});

Refferal.post('/team-details', async (req, res) => {


    ReferralUserReport.team_details(req.body, res).then(data => res.json(data));
});

Refferal.post('/team-level-details', async (req, res) => {


    ReferralUserReport.team_level_details(req.body, res).then(data => res.json(data));
});


Refferal.get('/company-portfolio', async (req, res) => {


    ReferralUserReport.companyportfolio(req.body, res).then(data => res.json(data));
});

Refferal.post('/target-royality-graph', async (req, res) => {


    ReferralUserReport.userTargetRoyalityGraph(req.body, res).then(data => res.json(data));
});

Refferal.post('/total-rank-distribution', async (req, res) => {


    ReferralUserReport.TotalRankDistribution(req.body, res).then(data => res.json(data));
});


// Refferal.post('/today-referral-detail', async (req, res) => {
//     ReferralUserReport.today_referral_detail(req.body,res).then(data => res.json(data));
// });


Refferal.post('/user-teams', async (req, res) => {


    ReferralUserReport.userTeams(req.body, res).then(data => res.json(data));
});

Refferal.post('/user-referrals', async (req, res) => {


    ReferralUserReport.userReferrals(req.body, res).then(data => res.json(data));
});

Refferal.post('/user-prime-product-list', async (req, res) => {

    ReferralUserReport.userPrimeProduct(req.body, res).then(data => res.json(data));
});


Refferal.post('/user-earning', async (req, res) => {

    ReferralUserReport.userEarning(req.body, res).then(data => res.json(data));
});

Refferal.post('/prime-users-report', async (req, res) => {

    ReferralUserReport.incomeReport(req.body, res).then(data => res.json(data));
});


//
module.exports = Refferal;
