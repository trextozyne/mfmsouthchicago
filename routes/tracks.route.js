const express = require('express');
const router = express.Router();
const multer = require('multer');
var path = require('path');


const storage = multer.memoryStorage();
const upload = multer({ storage: storage});

const tracks_controller = require('../controllers/tracks.controller');
//
// router.post('/create', upload.array('eventFileInput', 12), events_controller.events_create);

router.post('/create', upload.single("track"), tracks_controller.tracks_create);
router.get('/find', tracks_controller.tracks_all);
router.get('/:trackID', tracks_controller.tracks_details);
router.get('/download/:trackID', tracks_controller.tracks_download);
router.delete('/delete/:fileID', tracks_controller.tracks_delete_single);
router.delete('/drop', tracks_controller.tracks_delete_all);


module.exports = router;
