const Slide = require('../models/slides.model');
let fs = require('fs');
let mongodb = require('mongodb');
const cloudinary =  require('../config/cloudinaryConfig');
var Datauri = require('datauri');

exports.slides_create = async (req, res, next) => {
    let sliderType = req.body.sliderType;
    let slider_event_date = req.body['slider_event_date'];
    let slider_content1 = req.body['slider_content1'];
    let slider_content2 = req.body['slider_content2'];

    let slides = new Slide(
        {
                sliderType: sliderType,
                slider_event_date: slider_event_date,
                slider_content1: slider_content1,
                slider_content2: slider_content2,
                sliderScheduleType: parseInt(req.body.sliderScheduleType)
        }
    );

    try {
        let promises = [];

        const dUri = new Datauri();

        const uploader = async (path) => await cloudinary.uploads(path, 'Mfm-Images');

        let files = [];
        for (let key in req.files) {
            files.push(req.files[key][0])
        }
        // console.log(req.files);
        // console.log(files);

        for (const file in files) {

            if (files[file].fieldname === 'bg-img' && typeof files[file].fieldname !== "undefined") {
                // const {path} = files[file];

                const dataUri = req => dUri.format(path.extname(files[file].originalname).toString(), files[file].buffer);

                const file = dataUri(req).content;

                promises.push(await uploader(file));

                // fs.unlink('./' + path, (err) => {
                //     if (err) console.log(err);
                // });
            }

            if (files[file].fieldname === 'img-1' && typeof files[file].fieldname !== "undefined") {
                // const {path} = files[file];

                const dataUri = req => dUri.format(path.extname(files[file].originalname).toString(), files[file].buffer);

                const file = dataUri(req).content;

                promises.push(await uploader(file));

                // fs.unlink('./' + path, (err) => {
                //     if (err) console.log(err);
                // });
            }

            if (files[file].fieldname === 'img-2' && typeof files[file].fieldname !== "undefined") {
                // const {path} = files[file];

                const dataUri = req => dUri.format(path.extname(files[file].originalname).toString(), files[file].buffer);

                const file = dataUri(req).content;

                promises.push(await uploader(file));

                // fs.unlink('./' + path, (err) => {
                //     if (err) console.log(err);
                // });
            }
        }

        Promise.all(promises).then(function () {
            // returned data is in arguments[0], arguments[1], ... arguments[n]
            slides.bgImgFilename = arguments[0][0].public_id;
            slides.bgImgPath = arguments[0][0].url;

            slides.img1Filename = arguments[0][1].public_id;
            slides.img1Path = arguments[0][1].url;

            slides.img2Filename = arguments[0][2].public_id;
            slides.img2Path = arguments[0][2].url;

            //perform save operation on the last loop
            slides.save(function (err) {
                if (err) {
                    return next(err);
                }
            });

            if (i === arguments[0].length-1) {
                console.log("sent");
                if(!res.headersSent)
                    res.send('Created successfully');//res is important to ajax in order to proceed else error
            }
        });
    } catch (err) {
        next(err);
    }


    // res.status(200).json({
    //     data: url
    // });
    // res.send('Created successfully')
};

exports.slides_all = function (req, res, next) {
    Slide.find(({}), function (err, slides) {
        if (err) return next(err);
        slides.sort(function (a, b) {
            return a.sliderType.localeCompare(b.sliderType);
        });
        // console.log(slides);
        res.send(slides);
    });
};

exports.slides_details = function (req, res, next) {
    Slide.findById(req.params.id, function (err, slides) {
        if (err) return next(err);
        res.send(slides);
    })
};


function performUpdate(res, id, sliderType, slider_event_date, slider_content1, slider_content2, bgImgFilename,
                       bgImgPath, img1Filename, img1Path, img2Filename, img2Path, sliderScheduleType, next) {
    Slide.updateMany({"_id": id}, {
        $set: {
            "sliderType" : sliderType,
            "slider_event_date" : slider_event_date,
            "slider_content1" : slider_content1,
            "slider_content2" : slider_content2,
            "bgImgFilename" : bgImgFilename,
            "bgImgPath" : bgImgPath,
            "img1Filename" : img1Filename,
            "img1Path" : img1Path,//$
            "img2Filename" : img2Filename,
            "img2Path" : img2Path,
            "sliderScheduleType": sliderScheduleType
        }
    },{multi: true}, function (err, slides) {
        if (err) return next(err);
        res.send('Slide udpated.');
        console.log("success");
    });
}

exports.slides_update = async (req, res, next) => {
    let sliderType = req.body.sliderType;
    let slider_event_date = req.body['slider_event_date'];
    let slider_content1 = req.body['slider_content1'];
    let slider_content2 = req.body['slider_content2'];
    let sliderScheduleType = parseInt(req.body.sliderScheduleType);

    let bgImgFilename;
    let bgImgPath;
    let img1Filename;
    let img1Path;
    let img2Filename;
    let img2Path;
    if(typeof req.files['bg-img'] === "undefined" || typeof req.files['img-1'] === "undefined" || typeof req.files['img-2'] === "undefined"){
        bgImgFilename = req.body.bgImgFilename;
        bgImgPath = req.body.bgImgPath;
        img1Filename = req.body.img1Filename;
        img1Path = req.body.img1Path;
        img2Filename = req.body.img2Filename;
        img2Path = req.body.img2Path;
    }



    if (!req.files) {
        //perform update operation on the last loop
        performUpdate(res, req.params.id, sliderType, slider_event_date, slider_content1, slider_content2, bgImgFilename, bgImgPath,
        img1Filename, img1Path, img2Filename, img2Path, sliderScheduleType, next);
    }else {
        try {
            let promises = [];
            const uploader = async (path, _id) => await cloudinary.updates(path, _id, 'Mfm-Images');

            let files = [];
            for (let key in req.files) {
                files.push(req.files[key][0])
            }

            for (const file in files) {

                console.log(files[file].fieldname);

                if (files[file].fieldname === 'bg-img' && typeof files[file].fieldname !== "undefined") {
                    const {path} = files[file];

                    promises.push(await uploader(path, req.body.bgImgFilename));

                    fs.unlink('./' + path, (err) => {
                        if (err) console.log(err);
                    });
                }

                if (files[file].fieldname === 'img-1' && typeof files[file].fieldname !== "undefined") {
                    const {path} = files[file];

                    promises.push(await uploader(path, req.body.img1Filename));

                    fs.unlink('./' + path, (err) => {
                        if (err) console.log(err);
                    });
                }

                if (files[file].fieldname === 'img-2' && typeof files[file].fieldname !== "undefined") {

                    const {path} = files[file];

                    promises.push(await uploader(path, req.body.img2Filename));

                    fs.unlink('./' + path, (err) => {
                        if (err) console.log(err);
                    });
                }
            }

            Promise.all(promises).then(function () {
                // returned data is in arguments[0], arguments[1], ... arguments[n]

                bgImgFilename = arguments[0][0].public_id;
                bgImgPath = arguments[0][0].url;

                img1Filename = arguments[0][1].public_id;
                img1Path = arguments[0][1].url;

                img2Filename = arguments[0][2].public_id;
                img2Path = arguments[0][2].url;

                //perform update operation on the last loop
                performUpdate(res, req.params.id, sliderType, slider_event_date, slider_content1, slider_content2, bgImgFilename, bgImgPath,
                    img1Filename, img1Path, img2Filename, img2Path, sliderScheduleType, next);
            }, function (err) {
                // error occurred
            });
        } catch (err) {
            next(err);
        }
    }
};

exports.slides_delete = async (req, res, next) => {
    let slide = null;

    Slide.findById(req.params.id, function (err, slides) {
        if (err) return next(err);
        slide = slides;
    });

    Slide.deleteOne({_id: new mongodb.ObjectID(req.params.id)}, async function(err, events){
        if (err) return next(err);

        try {
            let promises = [];
            const uploader = async (_id) => await cloudinary.delete(_id);

            let id;
            id = slide.bgImgFilename;

            promises.push(await uploader(id));

            id = slide.img1Filename;

            promises.push(await uploader(id));

            id = slide.img2Filename;

            promises.push(await uploader(id));

            Promise.all(promises).then(function () {
                res.send('Deleted successfully!');
            });

        } catch (err) {
            next(err)
        }

    })
};
//Simple version, without validation or sanitation
// exports.test = function (req, res) {
//     res.send('Greetings from the Test controller!');
// };

// empty the collection
// Slide.remove(err => {
//     if (err) throw err;
//     console.log("Removed all documents in 'Slide' collection.");
