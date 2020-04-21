const express = require('express');
const router = express.Router();
// const multer = require('multer');
var path = require('path');

// var storage = multer.diskStorage({
//     destination: function(req, file, callback){
//         callback(null, path.join(__dirname, 'assets/images/gallery')); // set the destination
//     },
//     filename: function(req, file, callback){
//         callback(null, 'events' + new Date().toISOString().replace(/:/g,'-') + '.jpg'); // set the file name and extension
//     }
// });

// var upload = multer({storage: storage});

const verse_controller = require('../controllers/verse.controller');
//
// router.post('/create', upload.array('eventFileInput', 12), verse_controller.events_create);
router.post('/create', verse_controller.verse_create);
router.get('/find', verse_controller.verse_all);
router.get('/:id', verse_controller.verse_details);
router.put('/:id/update', verse_controller.verse_update);
router.delete('/:id/delete', verse_controller.verse_delete);
router.delete('/drop', verse_controller.verse_collection_drop);


module.exports = router;
