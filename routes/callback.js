const express = require('express');

const router = express.Router();
const Masa = require('../controllers/Masa');
const Lll = require('../controllers/Lll');


const transaction_Lll = new Lll();
// Define a route for the '/index' path
router.get('/masa', Masa.callback);
router.get('/Lll', transaction_Lll.callback_v1);
// Export the router for use in other files
module.exports = router;