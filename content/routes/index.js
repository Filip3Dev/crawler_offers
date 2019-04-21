'use strict'

const express = require('express');
const router = express.Router();
const controler = require('../controlers/index')

router.get('/', controler.get);
router.post('/search', controler.busca);

module.exports = router;