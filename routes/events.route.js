const express = require('express');
const router = express.Router();
const multer = require('multer');
var path = require('path');

// let storage = multer.diskStorage({
//     destination: function(req, file, callback){
//         callback(null, path.join('./Views', 'assets/images/gallery')); // set the destination
//     },
//     filename: function(req, file, callback){
//         callback(null, 'events' + new Date().toISOString().replace(/:/g,'-') + path.extname(file.originalname)); // set the file name and extension
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

// var upload = multer({storage: storage});
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

const events_controller = require('../controllers/events.controller');
//
// router.post('/create', upload.array('eventFileInput', 12), events_controller.events_create);
router.post('/create', upload.single("eventFileInput"), events_controller.events_create);
// router.get('/find/:pageNum', events_controller.events_all);
router.get('/find', events_controller.events_all);
router.get('/:id', events_controller.events_details);
router.put('/:id/update', upload.single("eventFileInput"), events_controller.events_update);
router.delete('/:id/delete', events_controller.events_delete);


module.exports = router;


