const express = require('express');
const router = express.Router();
const resourcesInstrument = require('../controllers/resourcesInstrument.controller');
const uniformGroups = require('../controllers/uniforms-group.controller');

//RESOURCES INSTRUMENTS
router.post('/resources', resourcesInstrument.createResourceInstrument);
router.get('/resources/instruments', resourcesInstrument.readResourceInstruments);
router.post('/resource/delete/:id', resourcesInstrument.deleteResourceInstrument);
router.post('/resource/update/:id', resourcesInstrument.updateResourceInstrument);

// RESOURCES UNIFORMS
router.get('/resources/uniforms-groups', uniformGroups.readGroups);
router.get('/resources/uniforms-group-parts/:id', uniformGroups.readGroupParts);
router.post('/resources/uniforms/add-group', uniformGroups.createGroup);
router.post('/resources/uniforms/remove-group/:id', uniformGroups.removeGroup);
router.post('/resources/uniforms/edit-group/:id', uniformGroups.editGroup);

// RESOURCE UNIFORMS PARTS
router.post('/resources/uniforms/add-parts', uniformGroups.addParts);
router.post('/resources/uniforms/remove-part/:id', uniformGroups.removePart);
router.post('/resources/uniforms/edit-part/:id', uniformGroups.editPart);
router.post('/resources/uniforms-parts/assign', uniformGroups.assignMemberToPart);


module.exports = router;