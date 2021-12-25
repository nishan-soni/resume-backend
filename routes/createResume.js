const express = require('express')
const exportController = require('../controllers/exportController')
const router  = express.Router(); 

router.post('/create/:template', exportController.exportResume)

module.exports = router