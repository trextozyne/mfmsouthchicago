const express = require('express');
const router = express.Router();
const multer = require('multer');
var path = require('path');

// var storage = multer.diskStorage({
//     destination: function(req, file, callback){
//         callback(null, path.join('./Views', 'assets/images/gallery')); // set the destination
//     },
//     filename: function(req, file, callback){
//         callback(null, 'images' + new Date().toISOString().replace(/:/g,'-')  + path.extname(file.originalname)); // set the file name and extension
//     },
//     fileFilter: (req, file , callback)=> {
//         checkFileType(file, callback)
//     }
// });
//
// function checkFileType(file, callback) {
//     //Allowed ect
//     const filetypes = /jpeg|jpg|png|gif/;
//     //check ext
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = filetypes.test(path.extname(file.mimeType));
//
//     if (mimetype && extname) {
//         return callback(null, true)
//     } else {
//         callback("Error: Images Only!!!.")
//     }
// }
const storage = multer({
    fileFilter: function (req, file, callback) {

        const filetypes = /jpeg|jpg|png|gif/;
        //check ext
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(path.extname(file.mimeType));

        if (mimetype && extname) {
            return callback(null, true)
        } else {
            callback("Error: Images Only!!!.")
        }
    }
});

// const storage = multer.memoryStorage();

var upload = multer({storage});

const photoalbum_controller = require('../controllers/photoalbum.controller');
//
// router.post('/create', upload.single("file"), photoalbum_controller.photoalbum_create);
router.post('/create', upload.array('file', 20), photoalbum_controller.photoalbum_create);
router.get('/find', photoalbum_controller.photoalbum_all);
router.get('/:id', photoalbum_controller.photoalbum_details);
router.put('/:id/update', upload.single("file"), photoalbum_controller.photoalbum_update);
router.delete('/:id/delete', photoalbum_controller.photoalbum_delete);

// a simple test url to check that all of our files are communicating correctly.
router.get('/test', photoalbum_controller.test);
module.exports = router;
