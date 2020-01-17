const Slide = require('../models/slides.model');
var fs = require('fs');
let mongodb = require('mongodb');
var path = require('path');
let counter = 0;


exports.slides_create = async (req, res, next) => {
    // console.log(title);
    console.log(req.body);
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


    if(typeof req.files['bg-img'] !== "undefined"){
        let bgImgFilename = req.files['bg-img'][0].filename;
        let bgImgPath = req.files['bg-img'][0].path;
        slides.bgImgFilename = bgImgFilename;
        slides.bgImgPath = bgImgPath;
    }

    if(typeof req.files['img-1'] !== "undefined"){
        let img1Filename = req.files['img-1'][0].filename;
        let img1Path = req.files['img-1'][0].path;
        slides.img1Filename = img1Filename;
        slides.img1Path = img1Path;
    }

    if(typeof req.files['img-2'] !== "undefined"){
        let img2Filename = req.files['img-2'][0].filename;
        let img2Path = req.files['img-2'][0].path;
        slides.img2Filename = img2Filename;
        slides.img2Path = img2Path;
    }
    // console.log(req.files);

    slides.save(function (err) {
        if (err) {
            return next(err);
        }
    })
    res.send('Slide Created successfully')
};

exports.slides_all = function (req, res, next) {
    Slide.find(({}), function (err, slides) {
        if (err) return next(err);
        slides.sort(function (a, b) {
            return a.sliderType.localeCompare(b.sliderType);
        });
        console.log(slides);
        res.send(slides);
    });
};

exports.slides_details = function (req, res, next) {
    Slide.findById(req.params.id, function (err, slides) {
        if (err) return next(err);
        res.send(slides);
    })
};

exports.slides_update = function (req, res, next) {
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
    console.log(req.body);
    console.log(req.files);

    if (req.files) {
        if(typeof req.files['bg-img'] !== "undefined"){
            bgImgFilename = req.files['bg-img'][0].filename;
            bgImgPath = req.files['bg-img'][0].path;

            //unlink or delete image in folder gallery
            fs.unlinkSync(path.join("assets/images/slide/", req.body.bgImgFilename));
        }
        if(typeof req.files['img-1'] !== "undefined"){
            img1Filename = req.files['img-1'][0].filename;
            img1Path = req.files['img-1'][0].path;

            //unlink or delete image in folder gallery
            fs.unlinkSync(path.join("assets/images/slide/", req.body.img1Filename));
        }
        if(typeof req.files['img-2'] !== "undefined"){
            img2Filename = req.files['img-2'][0].filename;
            img2Path = req.files['img-2'][0].path;

            //unlink or delete image in folder gallery
            fs.unlinkSync(path.join("assets/images/slide/", req.body.img2Filename));
        }
    }

    Slide.updateMany({"_id": req.params.id}, {
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
    });
};

exports.slides_delete = function (req, res, next) {
    // Slide.findOneAndDelete (req.params.id, function (err) {
    Slide.deleteOne({_id: new mongodb.ObjectID(req.params.id)}, function(err, events){
        if (err) return next(err);
        res.send('Deleted successfully!');
    })
};
//Simple version, without validation or sanitation
exports.test = function (req, res) {
    res.send('Greetings from the Test controller!');
};

// empty the collection
// Slide.remove(err => {
//     if (err) throw err;
//     console.log("Removed all documents in 'Slide' collection.");
