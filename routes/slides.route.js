const express = require('express');
const router = express.Router();
const multer = require('multer');

let path = require('path');


let storage = multer.diskStorage({
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

// import Datauri from 'datauri';
//
// const storage = multer.memoryStorage();

// const multerUploads = multer({ storage }).single('image');

// const dUri = new Datauri();
//
// /**
//  * @description This function converts the buffer to data url
//  * @param {Object} req containing the field object
//  * @returns {String} The data url from the string buffer
//  */
// const dataUri1 = req => dUri.format(path.
// extname(req.files['bg-img'].originalname).toString(), req.files['bg-img'].buffer);
// const dataUri2 = req => dUri.format(path.
// extname(req.files['bg-img'].originalname).toString(), req.files['bg-img'].buffer);
// const dataUri3 = req => dUri.format(path.
// extname(req.files['bg-img'].originalname).toString(), req.files['bg-img'].buffer);
//
// export { dataUri1, dataUri2, dataUri3 };
//
let upload = multer({storage: storage});

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
