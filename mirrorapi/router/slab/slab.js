const express = require('express');
const SlabController = require('../../controller/slab/slab.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');

const slab = express.Router();

slab.post('/add-slab',
    //authenticateJWT, logMiddleware,
    (req, res) => {
        SlabController.addSlab(req, res);
    }
);

module.exports = slab;