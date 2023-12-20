const express = require('express');

const router = express.Router();
const Masa = require('../controllers/Masa');


router.get('/masa/transaction', Masa.index);

module.exports = router;