const PhotoAlbum = require('../models/photoalbum.model');
var fs = require('fs');
let mongodb = require('mongodb');
var path = require('path');
let counter = 0;


exports.photoalbum_create = async (req, res, next) => {
    let title = req.body.title.toString().split(",").pop();
    console.log(req.files);
    req.files.forEach(function(value, index) {

        const imgName = value.filename;

        let photoalbum = new PhotoAlbum(
            {
                title: title,
                img: value.path,
                imgName:  imgName,
                albums: {u_name: req.body.albums.u_name, u_title: req.body.albums.u_title}
            }
        );

        console.log(photoalbum);

        photoalbum.save(function (err) {
            if (err) {
                return next(err);
            }
        })
    })
    res.send('Product Created successfully')
};

exports.photoalbum_all = function (req, res, next) {
    PhotoAlbum.find({}, function (err, photoalbum) {
        if (err) return next(err);
        res.send(photoalbum);
    });
};

exports.photoalbum_details = function (req, res, next) {
    PhotoAlbum.findById(req.params.id, function (err, photoalbum) {
        if (err) return next(err);
        res.send(photoalbum);
    })
};

exports.photoalbum_update = function (req, res, next) {
    const title = req.body.title.toString().split(",").pop();
    const album_name = req.body.albums[0].u_name;
    const album_title =  req.body.albums[0].u_title;
    let img = req.body.img.toString().slice( 1 );
    // img = img;
    let imgName = req.body.imgName.toString();
    console.log(img);
    if(req.file) {
        //unlink or delete image in folder gallery
        fs.unlinkSync(path.join("assets/images/gallery/", req.body.imgName));

        img = req.file.path;
        imgName = req.file.filename;
    }

    PhotoAlbum.updateMany({"_id": req.params.id}, {
        $set: {
            "title" : title,
            "img" : img,
            "imgName" : imgName,
            "albums.0.u_name" : album_name,//$
            "albums.0.u_title" : album_title

        }
    },{multi: true}, function (err, photoalbum) {
        if (err) return next(err);
        res.send('PhotoAlbum udpated.');
    });
};

exports.photoalbum_delete = function (req, res, next) {
    // PhotoAlbum.findOneAndDelete (req.params.id, function (err) {
    PhotoAlbum.deleteOne({_id: new mongodb.ObjectID(req.params.id)}, function(err, events){
        if (err) return next(err);
        res.send('Deleted successfully!');
    })
};
//Simple version, without validation or sanitation
exports.test = function (req, res) {
    res.send('Greetings from the Test controller!');
};

// empty the collection
// PhotoAlbum.remove(err => {
//     if (err) throw err;
//     console.log("Removed all documents in 'PhotoAlbum' collection.");
