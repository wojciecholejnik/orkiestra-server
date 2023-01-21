const express = require('express');
const router = express.Router();
const contributionsController = require('../controllers/contributions.controller');

router.post('/addContributionList', contributionsController.createContributionList);
router.get('/getContributionListForYear/:year', contributionsController.getContributionListForYear);
router.post('/editContributeListForMember', contributionsController.editContributeListForMember);
router.post('/editListMembers', contributionsController.editListMembers);


module.exports = router;