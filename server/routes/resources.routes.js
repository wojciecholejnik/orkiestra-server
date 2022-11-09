const express = require('express');
const router = express.Router();
const resourcesController = require('../controllers/resourcesItems.controller');

router.post('/resources', resourcesController.createResource);
router.get('/resources/instruments', resourcesController.readResourcesInstruments);
router.post('/resource/delete/:id', resourcesController.deleteResource);
router.post('/resource/update/:id', resourcesController.updateResource);

module.exports = router;