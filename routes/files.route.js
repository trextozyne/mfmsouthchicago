const express = require('express');
const router = express.Router();
const multer = require('multer');
var path = require('path');


const storage = multer({
    fileFilter: function (req, file, cb) {

        var filetypes = /pdf/;
        var mimetype = filetypes.test(file.mimetype);
        var extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb("Error: File upload only supports pdf");
    }
});
// const storage = multer.memoryStorage()

const upload = storage;

const files_controller = require('../controllers/files.controller');
//
// router.post('/create', upload.array('eventFileInput', 12), events_controller.events_create);

router.post('/create', upload.single("pdfFile"), files_controller.files_create);
router.get('/find', files_controller.files_all);
router.get('/:fileID', files_controller.files_details);
router.get('/download/:fileID', files_controller.files_download);
router.delete('/delete/:fileID', files_controller.files_delete_single);
router.delete('/drop', files_controller.files_delete_all);


module.exports = router;
