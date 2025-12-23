const express = require('express');
const menuController = require('../../controller/setting/menu.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
//const logMiddleware = require('../../middleware/logMiddleware');



const menus = express.Router();


menus.post('/get-menu',(req, res) => {
	menuController.getMenu(req.body,res).then(data => res.json(data));
});


menus.post('/set-menu-permission',(req, res) => {
	menuController.setMenuPermission(req.body,res).then(data => res.json(data));
});


menus.post('/get-menu-permission',(req, res) => {
	menuController.setMenuPermission(req.body,res).then(data => res.json(data));
});

//
module.exports = menus;
