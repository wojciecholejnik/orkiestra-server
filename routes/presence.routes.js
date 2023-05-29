const express = require('express');
const router = express.Router();
const presenceController = require('../controllers/presence.controller');

router.get('/readPresences', presenceController.readPresences);
router.get('/readPresences/:year', presenceController.readPresencesByDate);
router.post('/createPresence', presenceController.createPresence);
router.delete('/deletePresence/:id', presenceController.deletePresence);
router.put('/updatePresence/:id', presenceController.updatePresence);

module.exports = router;