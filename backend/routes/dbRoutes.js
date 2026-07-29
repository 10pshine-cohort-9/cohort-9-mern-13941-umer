const express = require('express');

const router = express.Router();
const { checkDbStatus } = require('../controllers/dbController');

router.get('/status', checkDbStatus);

module.exports = router;