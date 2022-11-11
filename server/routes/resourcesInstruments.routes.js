const express = require('express');
const router = express.Router();
const resourcesInstrument = require('../controllers/resourcesInstrument.controller');
const uniformGroups = require('../controllers/uniforms-group.controller');

router.post('/resources', resourcesInstrument.createResourceInstrument);
router.get('/resources/instruments', resourcesInstrument.readResourceInstruments);
router.post('/resource/delete/:id', resourcesInstrument.deleteResourceInstrument);
router.post('/resource/update/:id', resourcesInstrument.updateResourceInstrument);

router.get('/resources/uniforms-groups', uniformGroups.readGroups);
router.get('/resources/uniforms-group-parts/:id', uniformGroups.readGroupParts);
router.post('/resources/uniforms/add-group', uniformGroups.createGroup);
router.post('/resources/uniforms/remove-group/:id', uniformGroups.removeGroup);


module.exports = router;