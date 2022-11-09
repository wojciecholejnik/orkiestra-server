const express = require('express');
const router = express.Router();
const resourcesController = require('../controllers/resourcesItems.controller');

router.post('/resources', resourcesController.createResource);
router.get('/resources', resourcesController.readResources);
router.post('/resource/delete/:id', resourcesController.deleteResource);

module.exports = router;