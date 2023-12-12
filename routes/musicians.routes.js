const express = require('express');
const router = express.Router();
const musicianController = require('../controllers/musicians.controller');

router.get('/musicians', musicianController.readMusicians);
router.get('/musician/:id', musicianController.readMusicianById);
router.get('/musicians/active', musicianController.readActiveMusicians);
router.get('/musicians/ex', musicianController.readExMusicians);
router.get('/musicians/main-staff', musicianController.readMainStaffMuscians);
router.get('/musicians/spectators', musicianController.readSpectators);
router.get('/musicians/students', musicianController.readMainStudentsMusicians);
router.get('/musicians/name&id', musicianController.readActiveMusiciansNames);
router.post('/musicians', musicianController.createMusician);
router.post('/musician/:id', musicianController.updateMusician);
router.post('/musician/delete/:id', musicianController.deleteMusician);
router.get('/musicians/instructors', musicianController.readInstructors);
router.get('/musician/resourceInstruments/:id', musicianController.readMemberInstruments)

router.get('/member/details/uniforms/:id', musicianController.readMemberUniforms);

router.post('/user/login', musicianController.loginUser);
router.post('/user/add', musicianController.addUser);
router.post('/user/edit', musicianController.editUser);
router.get('/usersToManage', musicianController.readUsersToManage);
router.post('/manageUser', musicianController.manageUser);

module.exports = router;