const express = require('express')
const route = express.Router();
const authCtrl = require('../controller/auth');

route.post('/check', authCtrl.check)

module.exports = route;