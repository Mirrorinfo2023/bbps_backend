const express = require('express');
const UserSummaryController = require('../../controller/reports/user_summary.controller');
const UserdetailsController = require('../../controller/reports/user_details.controller');
const RechangeReportController = require('../../controller/reports/recharge_report.controller');
const RedeemController = require('../../controller/reports/redeem.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const CashbackReportController = require('../../controller/reports/cashback_report.controller');
const PrimeReportController = require('../../controller/reports/prime_wallet_report.controller');
const billPayReportController = require('../../controller/reports/bill_payment.controller');
const royalityController = require('../../controller/reports/royality.controller');
const epinWalletReportController = require('../../controller/reports/epin_wallet.controller');
const idCardReportController = require('../../controller/reports/idcard_details.controller');
const logMiddleware = require('../../middleware/logMiddleware');


const { configureMulter } = require('../../utility/upload.utility');


const report = express.Router();

const cacheMiddleware = require('../../middleware/cacheMiddleware');
const initializeRedis = require('../../../redis');
const redisClient = initializeRedis();

const endpoints = {
    '/user-summary': 'fb3898964f85e3cd9680f6f23606c2fceffad842',
    '/user-details': '70b12e5fc4d4c51474b2b32706b248af89fce3d4',
    '/recharge-report': 'a3a0f64509f03bd79100fe156229a1bd0224a081',
    '/get-redeem-report': 'fc65092846f39a738cff7c2b2f630ac01e981980',
    '/get-redeem-history': '3b81e6c552b7037a455fc4a9f77e6c627ec5de11',
    '/cashback-report': '5c8aac211aa3976a71d11bde4ba97866d32a647e',
    '/prime-wallet-report': '4918fe22e9d122dc02638b33b7be5563b45f0e0f',
    '/bill-payment-report': '6987032b12ec453b6541d5c8f12e42d5960507b2',
    '/royality-income-report': '4f078c9a45aa5b1cff4c2ccd2b3030bb8c2ee9c3',
    '/recharge-hold-report': 'ecc93a47a513d654940001ee988b417914509670',
    '/bill-payment-hold-report': '337c96af51005fa0ca0f81174adea3fc32d9a45b',
    'epin-wallet-history': 'f9165ea86be4708b8c2ea02f66c9fd5dc7094135'

};


report.post('/fb3898964f85e3cd9680f6f23606c2fceffad842', authenticateJWT, logMiddleware, async (req, res) => {
    UserSummaryController.summary(req.body, res)
        .then(data => res.json(data))
        .catch(error => {
            console.error('Error requesting User Summary:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

report.post('/70b12e5fc4d4c51474b2b32706b248af89fce3d4', authenticateJWT, logMiddleware, async (req, res) => {
    UserdetailsController.details(req.body, res)
        .then(data => res.json(data))
        .catch(error => {
            console.error('Error requesting User Details:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

report.post('/a3a0f64509f03bd79100fe156229a1bd0224a081', authenticateJWT, logMiddleware, async (req, res) => {
    RechangeReportController.recharge(req.body, res)
        .then(data => res.json(data))
        .catch(error => {
            console.error('Error requesting Recharge Report:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


report.post('/fc65092846f39a738cff7c2b2f630ac01e981980', authenticateJWT, logMiddleware, async (req, res) => {

    RedeemController.GetRedeem(req.body, res)
        .then(data => res.json(data))
        .catch(error => {
            console.error('Error requesting Get Redeem Report:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

report.post('/3b81e6c552b7037a455fc4a9f77e6c627ec5de11', authenticateJWT, logMiddleware, async (req, res) => {

    RedeemController.GetRedeemHistroy(req.body, res)
        .then(data => res.json(data))
        .catch(error => {
            console.error('Error requesting Get Redeem Histroy:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

report.post('/5c8aac211aa3976a71d11bde4ba97866d32a647e', authenticateJWT, logMiddleware, async (req, res) => {
    CashbackReportController.cashbackReport(req.body, res)
        .then(data => res.json(data))
        .catch(error => {
            console.error('Error requesting Get Cashback Report:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

report.post('/4918fe22e9d122dc02638b33b7be5563b45f0e0f', authenticateJWT, logMiddleware, async (req, res) => {
    PrimeReportController.primeReport(req.body, res)
        .then(data => res.json(data))
        .catch(error => {
            console.error('Error requesting prime wallet Report:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


report.post('/6987032b12ec453b6541d5c8f12e42d5960507b2', authenticateJWT, logMiddleware, (req, res) => {
    billPayReportController.bill_payment(req.body, res)
        .then(data => res.json(data))
        .catch(error => {
            console.error('Error requesting Bill Payment Report:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


report.post('/4f078c9a45aa5b1cff4c2ccd2b3030bb8c2ee9c3', authenticateJWT, logMiddleware, async (req, res) => {
    royalityController.GetRoyalityHistroy(req.body, res)
        .then(data => res.json(data))
        .catch(error => {
            console.error('Error requesting Royality Income Report:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


report.post('/ecc93a47a513d654940001ee988b417914509670', authenticateJWT, logMiddleware, async (req, res) => {
    RechangeReportController.rechargeHoldList(req.body, res)
        .then(data => res.json(data))
        .catch(error => {
            console.error('Error requesting Recharge Hold Report:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


report.post('/337c96af51005fa0ca0f81174adea3fc32d9a45b', authenticateJWT, logMiddleware, (req, res) => {
    billPayReportController.bill_payment(req.body, res).then(data => res.json(data));
});

report.post('/f9165ea86be4708b8c2ea02f66c9fd5dc7094135', authenticateJWT, logMiddleware, (req, res) => {
    epinWalletReportController.epinWallet(req.body, res).then(data => res.json(data));
});




report.post('/user-summary', cacheMiddleware(900), async (req, res) => {
    // UserSummaryController.summary(req.body,res).then(data => res.json(data));

    try {

        const key = req.originalUrl;
        const data = await UserSummaryController.summary(req.body, res);
        // const data = {"message":"testing data.."};
        // Cache the data in Redis
        await redisClient.setex(key, 900, JSON.stringify(data));

        res.json(data); // Send the response and cache data
    } catch (error) {
        console.error('Error requesting User Summary:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// report.post('/user-details',cacheMiddleware(900), async (req, res) => {
//       try {

//                 const key = req.originalUrl;
//                 const data = await UserdetailsController.details(req.body, res);
//                 // const data = {"message":"testing data.."};
//                 // Cache the data in Redis
//                 await redisClient.setex(key, 900, JSON.stringify(data));

//                 res.json(data); // Send the response and cache data
//                 } catch (error) {
//                     console.error('Error requesting User Summary:', error);
//                     res.status(500).json({ error: 'Internal Server Error' });
//                 }

// });


report.post('/user-details', async (req, res) => {
    try {

        //const key = req.originalUrl;
        const data = await UserdetailsController.details(req.body, res);
        // const data = {"message":"testing data.."};
        // Cache the data in Redis
        //await redisClient.setex(key, 900, JSON.stringify(data));

        res.json(data); // Send the response and cache data
    } catch (error) {
        console.error('Error requesting User Summary:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});

report.post('/recharge-report', cacheMiddleware(900), async (req, res) => {
    try {

        const key = req.originalUrl;
        const data = await RechangeReportController.recharge(req.body, res);
        // const data = {"message":"testing data.."};
        // Cache the data in Redis
        await redisClient.setex(key, 900, JSON.stringify(data));

        res.json(data); // Send the response and cache data
    } catch (error) {
        console.error('Error requesting User Summary:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});


report.post('/get-redeem-report', async (req, res) => {

    try {

        //const key = req.originalUrl;
        const data = await RedeemController.GetRedeem(req.body, res);
        // const data = {"message":"testing data.."};
        // Cache the data in Redis
        //await redisClient.setex(key, 900, JSON.stringify(data));

        res.json(data); // Send the response and cache data
    } catch (error) {
        console.error('Error requesting User Summary:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});

report.post('/get-redeem-history', async (req, res) => {


    RedeemController.GetRedeemHistroy(req.body, res)
        .then(data => res.json(data))
        .catch(error => {
            console.error('Error requesting Get Redeem Histroy:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

report.post('/cashback-report', async (req, res) => {

    CashbackReportController.cashbackReport(req.body, res)
        .then(data => res.json(data))
        .catch(error => {
            console.error('Error requesting Get Cashback Report:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });

});

report.post('/prime-wallet-report', async (req, res) => {

    PrimeReportController.primeReport(req.body, res)
        .then(data => res.json(data))
        .catch(error => {
            console.error('Error requesting prime wallet Report:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });


});


report.post('/bill-payment-report', async (req, res) => {


    billPayReportController.bill_payment(req.body, res)
        .then(data => res.json(data))
        .catch(error => {
            console.error('Error requesting Bill Payment Report:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });


});


report.post('/royality-income-report', async (req, res) => {


    royalityController.GetRoyalityHistroy(req.body, res)
        .then(data => res.json(data))
        .catch(error => {
            console.error('Error requesting Royality Income Report:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


report.post('/recharge-hold-report', async (req, res) => {
    RechangeReportController.rechargeHoldList(req.body, res).then(data => res.json(data));
});

report.post('/bill-payment-hold-report', (req, res) => {
    billPayReportController.bill_payment(req.body, res).then(data => res.json(data));
});


report.post('/epin-wallet-summary', (req, res) => {
    epinWalletReportController.epinWalletSummary(req.body, res).then(data => res.json(data));
});

report.post('/idcard-request-report', (req, res) => {
    idCardReportController.idCard_report(req.body, res).then(data => res.json(data));
});


report.post('/update-idCard-status', (req, res) => {
    const ipAddress = req.clientIpAddress;
    idCardReportController.updateIdCardStatus(req.body, res, ipAddress).then(data => res.json(data));
});


//
module.exports = report;
