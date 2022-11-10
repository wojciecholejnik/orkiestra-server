const express = require('express');
const router = express.Router();
const resourcesInstrument = require('../controllers/resourcesInstrument.controller');

router.post('/resources', resourcesInstrument.createResourceInstrument);
router.get('/resources/instruments', resourcesInstrument.readResourceInstruments);
router.post('/resource/delete/:id', resourcesInstrument.deleteResourceInstrument);
router.post('/resource/update/:id', resourcesInstrument.updateResourceInstrument);

module.exports = router;