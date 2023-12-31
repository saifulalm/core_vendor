const express = require('express');

const router = express.Router();
const Masa = require('../controllers/Masa');
const Myim3 = require('../controllers/Myim3');
const transaction = new Myim3();

router.get('/masa/transaction', Masa.index);
router.get('/myim3/transaction', transaction.Index_v1 );

module.exports = router;