const express = require('express');

const router = express.Router();

const Masa = require('../controllers/Masa');
const Myim3 = require('../controllers/Myim3');
const Lll = require('../controllers/Lll');

const transaction_myim3 = new Myim3();
const transaction_Lll = new Lll();

router.get('/masa/transaction', Masa.index);
router.get('/myim3/transaction', transaction_myim3.Index_v1 );
router.get('/Lll/transaction', transaction_Lll.index_v1 );

module.exports = router;