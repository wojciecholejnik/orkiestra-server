const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/events.controller');


router.get('/getEventsForYear/:year', eventsController.getEventsListForYear);
router.get('/getNearestEvent', eventsController.getNearestEvent);
router.post('/addNewEvent/:year', eventsController.addNewEvent);
router.post('/updateEvent/:year', eventsController.updateEvent);
router.post('/deleteEvent/:year', eventsController.deleteEvent);


module.exports = router;