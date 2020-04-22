const express = require('express');
const router = express.Router();
// const multer = require('multer');
var path = require('path');

const ytplayLive_controller = require('../controllers/ytplayLive.controller');
//
// router.post('/create', upload.array('eventFileInput', 12), ytplayLive_controller.events_create);
router.post('/create', ytplayLive_controller.ytplayLive_create);
router.get('/find', ytplayLive_controller.ytplayLive_all);
router.get('/:id', ytplayLive_controller.ytplayLive_details);
router.put('/:id/update', ytplayLive_controller.ytplayLive_update);
router.delete('/:id/delete', ytplayLive_controller.ytplayLive_delete);
router.delete('/drop', ytplayLive_controller.ytplayLive_collection_drop);


module.exports = router;
