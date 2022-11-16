const express = require('express');
const router = express.Router();
const sectionsColntroller = require('../controllers/sections.controller');

router.get('/sections', sectionsColntroller.readSections);
router.get('/section/:id', sectionsColntroller.readSectionById);
router.post('/sections', sectionsColntroller.createSection);
router.post('/section/:id', sectionsColntroller.updateSection);
router.post('/section/delete/:id', sectionsColntroller.deleteSection);

module.exports = router;