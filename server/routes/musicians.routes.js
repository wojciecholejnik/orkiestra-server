const express = require('express');
const router = express.Router();
const musicianController = require('../controllers/musicians.controller');

router.get('/musicians', musicianController.readMusicians);
router.get('/musician/:id', musicianController.readMusicianById);
router.get('/musicians/active', musicianController.readActiveMusicians);
router.get('/musicians/ex', musicianController.readExMusicians);
router.get('/musicians/main-staff', musicianController.readMainStaffMuscians);
router.get('/musicians/students', musicianController.readMainStudentsMusicians);
router.get('/musicians/name&id', musicianController.readActiveMusiciansNames);
router.post('/musicians', musicianController.createMusician);
router.post('/musician/:id', musicianController.updateMusician);
router.post('/musician/delete/:id', musicianController.deleteMusician);

module.exports = router;