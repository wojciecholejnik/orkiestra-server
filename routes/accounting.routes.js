const express = require('express');
const router = express.Router();
const accountingController = require('../controllers/accounting.controller');

router.get('/accounting/:year', accountingController.getContributionListForYear);
router.get('/accounting/active/:year', accountingController.getAllActiveBudgets);
router.post('/accounting', accountingController.createAccountingList);
router.post('/accounting/close', accountingController.closeBudgetForYear);
router.put('/accounting', accountingController.editAccountingList);


module.exports = router;