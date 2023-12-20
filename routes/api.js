const express = require('express');

const router = express.Router();
const Mido = require('../controllers/Mido');

// Define a route for the '/index' path
router.get('/mido/index', Mido.validation);
// Export the router for use in other files
module.exports = router;