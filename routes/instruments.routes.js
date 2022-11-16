const express = require('express');
const router = express.Router();
const instrumentsColntroller = require('../controllers/instruments.controller');

router.get('/instruments', instrumentsColntroller.readInstruments);
router.get('/instrument/:id', instrumentsColntroller.readInstrumentById);
router.get('/instrumentsBySection/:id', instrumentsColntroller.readInstrumentsBySection);
router.post('/instruments', instrumentsColntroller.createInstrument);
router.post('/instrument/:id', instrumentsColntroller.updateInstrument);
router.post('/instrument/delete/:id', instrumentsColntroller.deleteInstrument);

module.exports = router;