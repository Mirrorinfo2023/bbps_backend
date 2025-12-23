const express = require('express');
const referralPlanController = require('../../controller/referral/plan.controller');
const planPurchaseController = require('../../controller/referral/plan_purchase.controller');
const bankTransferController = require('../../controller/referral/bankTransfer.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');
const referralPlan = express.Router();



const endpoints = {
    '/get-referral-plan': 'c128bf13f4959e995c9c74ecf1aef8cb5c665423',
    '/get-referral-plan-product': 'd96b324577c88c2ae83bc629eb0c2ccc8ca98e13',
    '/purchase': 'd376ca2995b3d140552f1bf6bc31c2eda6c9cfc8',
    '/request-redeem': '1b11b22949aff1244922265015f806637a523f04',
    '/approve-redeem': 'ad2a9ab913b510abebf379e2d2edca4ff3cc18af',
    '/reject-redeem': 'b7a11d471434710e1618a20cf87eabb161fa18f5',
    '/bulk-royality-income': '32898e5fc9b7758fc17582339c16ff9bee074e4d',
    '/bank-transfer-request': 'c9dfa1ea1b1296531bae85fb446761708cfbcfea',
    '/check-notification': '0804f5aafcc9fa0064ae8f9d262907fd737831b5',
    '/affiliate-to-wallet': '593eb42effe5fa624b19fc755bb1815ab11cb1a9',
    '/affiliate-to-wallet-histroy': 'a24c7d1e83d93ec22c02f01121da07e897622e62',
    '/level-income-left-distributions':'ac70c3a0e7eebc62a4c6ed429875ee4204383780',
};


referralPlan.get('/c128bf13f4959e995c9c74ecf1aef8cb5c665423', authenticateJWT, logMiddleware, async (req, res) => {

	referralPlanController.getReferralPlan(req.query,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Get Refferal Plan:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


referralPlan.get('/d96b324577c88c2ae83bc629eb0c2ccc8ca98e13', authenticateJWT, logMiddleware, async (req, res) => {

	referralPlanController.getReferralPlanProduct(req.query,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Get Refferal Plan:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

//authenticateJWT

referralPlan.post('/d376ca2995b3d140552f1bf6bc31c2eda6c9cfc8', logMiddleware, async (req, res) => {
	planPurchaseController.Purchase(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Purchase plan:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


//authenticateJWT
referralPlan.post('/1b11b22949aff1244922265015f806637a523f04', logMiddleware, async (req, res) => {

	planPurchaseController.RequestRedeem(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Request Redeem:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});
referralPlan.post('/ad2a9ab913b510abebf379e2d2edca4ff3cc18af', authenticateJWT, logMiddleware, async (req, res) => {

	planPurchaseController.ApproveRedeem(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Approve Redeem:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


referralPlan.post('/b7a11d471434710e1618a20cf87eabb161fa18f5', authenticateJWT, logMiddleware, async (req, res) => {

	planPurchaseController.RejectRedeem(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Reject Redeem:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});



referralPlan.post('/c9dfa1ea1b1296531bae85fb446761708cfbcfea', authenticateJWT, logMiddleware, async (req, res) => {

	bankTransferController.BankTransferRequest(req.body,res).then(data => res.json(data));
});


referralPlan.post('/32898e5fc9b7758fc17582339c16ff9bee074e4d', async (req, res) => {
	planPurchaseController.insert_royality_income(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Bulk Royality Income:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

referralPlan.post('/0804f5aafcc9fa0064ae8f9d262907fd737831b5', authenticateJWT, logMiddleware, async (req, res) => {

	planPurchaseController.check_Notification(req.body,res).then(data => res.json(data));
});

referralPlan.post('/593eb42effe5fa624b19fc755bb1815ab11cb1a9', authenticateJWT, logMiddleware, async (req, res) => {

	bankTransferController.affiliateToWallet(req.body,res).then(data => res.json(data));
});

referralPlan.post('/a24c7d1e83d93ec22c02f01121da07e897622e62', authenticateJWT, logMiddleware, async (req, res) => {
	bankTransferController.affiliateToWalletHistory(req.body,res).then(data => res.json(data));
});








referralPlan.get('/get-referral-plan', async (req, res) => {

	referralPlanController.getReferralPlan(req.query,res).then(data => res.json(data));
});
referralPlan.post('/purchase', async (req, res) => {

	planPurchaseController.Purchase(req.body,res).then(data => res.json(data));
});

referralPlan.post('/request-redeem', async (req, res) => {

	planPurchaseController.RequestRedeem(req.body,res).then(data => res.json(data));
});


referralPlan.post('/get-referral-balance', async (req, res) => {

	planPurchaseController.ReferralBalance(req.body,res).then(data => res.json(data));
});


referralPlan.post('/approve-redeem', async (req, res) => {

	planPurchaseController.ApproveRedeem(req.body,res).then(data => res.json(data));
});


referralPlan.post('/reject-redeem', async (req, res) => {

	planPurchaseController.RejectRedeem(req.body,res).then(data => res.json(data));
});


//level-income-distributions if not done
referralPlan.post('/ac70c3a0e7eebc62a4c6ed429875ee4204383780', async (req, res) => {

	planPurchaseController.insert_direct_income_inr_hybridlevel_backendentry(req.body,res).then(data => res.json(data));
});

referralPlan.post('/affiliate-to-wallet', async (req, res) => {

	bankTransferController.affiliateToWallet(req.body,res).then(data => res.json(data));
});

referralPlan.post('/affiliate-to-wallet-histroy', async (req, res) => {
	bankTransferController.affiliateToWalletHistory(req.body,res).then(data => res.json(data));
});


referralPlan.post('/bulk-royality-income', async (req, res) => {

	planPurchaseController.insert_royality_income(req.body,res).then(data => res.json(data));
});

referralPlan.post('/check-notification', async (req, res) => {

	planPurchaseController.check_Notification(req.body,res).then(data => res.json(data));
});

referralPlan.post('/insert-level-income', async (req, res) => {

	planPurchaseController.insert_levelincome(req.body,res).then(data => res.json(data));
});


referralPlan.post('/update-prime-purchase-status', async (req, res) => {

	planPurchaseController.updatePrimePurchaseStatus(req.body,res).then(data => res.json(data));
});



//
module.exports = referralPlan;
