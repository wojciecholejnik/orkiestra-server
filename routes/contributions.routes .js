const express = require('express');
const router = express.Router();
const contributionsController = require('../controllers/contributions.controller');

router.post('/addContributionList', contributionsController.createContributionList);
router.get('/getContributionListForYear/:year', contributionsController.getContributionListForYear);


module.exports = router;