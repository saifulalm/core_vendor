const express = require('express');

const router = express.Router();
const Masa = require('../controllers/Masa');

// Define a route for the '/index' path
router.get('/masa', Masa.callback);

// Export the router for use in other files
module.exports = router;