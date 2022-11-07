const express = require('express');
const router = express.Router();
const musicianController = require('../controllers/musicians.controller');

router.get('/musicians', musicianController.readMusicians);
router.get('/musician/:id', musicianController.readMusicianById);
router.get('/musicians/active', musicianController.readActiveMusicians);
router.get('/musicians/ex', musicianController.readExMusicians);
router.post('/musicians', musicianController.createMusician);
router.post('/musician/:id', musicianController.updateMusician);
router.post('/musician/delete/:id', musicianController.deleteMusician);

module.exports = router;