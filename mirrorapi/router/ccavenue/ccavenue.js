const express = require('express');
const CCAvenueController = require('../../controller/ccavenue/ccavenue.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
//const logMiddleware = require('../../middleware/logMiddleware');

const routerurl = require('../../config/routerurl.config');
// const routerurl = require('../../config/encrypturl.config');
const urlRouter = routerurl.routerUrl();

const ccavenue = express.Router();

//urlRouter.paymentCcavenue

ccavenue.get('/payment',(req, res) => {
     // res.send('hello');
        CCAvenueController.payment(req.body,res).then( data => {
           res.send(data);
        } );
});


ccavenue.get('/payment-response',(req, res) => {
     // res.send('hello');
        CCAvenueController.paymentResponse(req.body,res).then( data => {
           res.send(data);
        } );
});




//
module.exports = ccavenue;
