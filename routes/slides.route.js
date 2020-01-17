const express = require('express');
const router = express.Router();
const multer = require('multer');
var path = require('path');

var storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, path.join('./Views', 'assets/images/slide')); // set the destination
    },
    filename: function(req, file, callback){
        callback(null, 'slides' + new Date().toISOString().replace(/:/g,'-')  + path.extname(file.originalname)); // set the file name and extension
    },
    fileFilter: (req, file , callback)=> {
        checkFileType(file, callback)
    }
});

function checkFileType(file, callback) {
    //Allowed ect
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

var upload = multer({storage: storage});

const slides_controller = require('../controllers/slides.controller');
//

router.post('/create', upload.fields([{name: 'bg-img', maxCount: 1}, {name: 'img-1', maxCount: 1},
    {name: 'img-2', maxCount: 1}]), slides_controller.slides_create);
// router.post('/create', upload.single("slideFileInput"), slides_controller.slides_create);
router.get('/find', slides_controller.slides_all);
router.get('/:id', slides_controller.slides_details);
router.put('/:id/update', upload.fields([{name: 'bg-img', maxCount: 1}, {name: 'img-1', maxCount: 1},
    {name: 'img-2', maxCount: 1}]), slides_controller.slides_update);
router.delete('/:id/delete', slides_controller.slides_delete);


module.exports = router;
