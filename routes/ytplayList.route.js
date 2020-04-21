const express = require('express');
const router = express.Router();
// const multer = require('multer');
var path = require('path');

const ytplayList_controller = require('../controllers/ytplayList.controller');
//
// router.post('/create', upload.array('eventFileInput', 12), ytplayList_controller.events_create);
router.post('/create', ytplayList_controller.ytplayList_create);
router.get('/find', ytplayList_controller.ytplayList_all);
router.get('/:id', ytplayList_controller.ytplayList_details);
router.put('/:id/update', ytplayList_controller.ytplayList_update);
router.delete('/:id/delete', ytplayList_controller.ytplayList_delete);
router.delete('/drop', ytplayList_controller.ytplayList_collection_drop);


module.exports = router;
