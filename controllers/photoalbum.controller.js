const PhotoAlbum = require('../models/photoalbum.model');
var fs = require('fs');
let mongodb = require('mongodb');
const cloudinary =  require('../config/cloudinaryConfig');
var path = require('path');
let counter = 0;


exports.photoalbum_create = async (req, res, next) => {
    // console.log(req.files);
    console.log(req.body);
    req.files.forEach(async function (value, index) {

        let photoalbum = new PhotoAlbum(
            {
                title: req.body.title,
                albums: {u_name: req.body.album_name, u_title: req.body.album_title}
            }
        );

        console.log(photoalbum);

        try {
            let promises = [];
            const uploader = async (path) => await cloudinary.uploads(path, 'Photos');

            const {path} = value;

            promises.push(await uploader(path));

            fs.unlink('./' + path, (err) => {
                if (err) console.log(err);
            });

            Promise.all(promises).then(function () {
                // returned data is in arguments[0], arguments[1], ... arguments[n]
                // console.log(arguments[0]);
                for (let i=0; i<arguments[0].length; i++) {
                    photoalbum.imgName = arguments[0][i].public_id;
                    photoalbum.img = arguments[0][i].url;

                    //perform save operation on the last loop
                    photoalbum.save(function (err) {
                        if (err) {
                            return next(err);
                        }
                    });

                    if (i === arguments[0].length-1) {
                        res.send('Product Created successfully');//res is important to ajax in order to proceed else error
                        console.log("sent")
                    }
                }
            });
        } catch (err) {
            next(err);
        }
    });
};

exports.photoalbum_all = function (req, res, next) {
    PhotoAlbum.find({}, function (err, photoalbum) {
        if (err) return next(err);
        res.send(photoalbum);
    });

    // Events.find(({}), {skip: (itemsPerPage * (req.params.pageNum-1)), limit: itemsPerPage}, function (err, events) {//query
    //     if (err) return next(err);
    //     console.log(events)
    //     res.send(events);
    // });

    // let itemsPerPage = 10
    //     , page = Math.max(0, req.params.pageNum);
    //
    // Events.find()
    //     //.select('name')
    //     .limit(itemsPerPage)
    //     .skip(itemsPerPage * page)
    //     .sort({
    //         name: 'asc'
    //     })
    //     .exec(function(err, events) {
    //         console.log(events);
    //         Events.count().exec(function(err, count) {
    //             res.send(events);
    //             // res.render('events', {
    //             //     events: events,
    //             //     page: page,
    //             //     pages: count / perPage
    //             // })
    //         })
    //     })

    // Events.find()
    //     .skip( req.params.pageNum > 0 ? ( ( req.params.pageNum - 1 ) * itemsPerPage ) : 0 )
    //     .limit( itemsPerPage )
    //     .forEach( events => {
    //         console.log(events);
    //         res.send(events);
    //     } );
};

exports.photoalbum_details = function (req, res, next) {
    PhotoAlbum.findById(req.params.id, function (err, photoalbum) {
        if (err) return next(err);
        res.send(photoalbum);
    })
};

function performUpdate(res, id, title, imgName, img, album_name, album_title, next) {
    PhotoAlbum.updateMany({"_id": id}, {
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
}

exports.photoalbum_update = async (req, res, next) => {
    const title = req.body.title;
    const album_name = req.body.album_name;
    const album_title = req.body.album_title;
    let img = req.body.img;
    let imgName = req.body.imgName;
    if (!req.file) {
        //perform update operation on the last loop
        performUpdate(res, req.params.id, title, imgName, img, album_name, album_title, next);
    } else {
        try {
            let promises = [];
            const uploader = async (path, _id) => await cloudinary.updates(path, _id, 'Photos');
            const {path} = req.file;

            let id = req.body.imgName;

            promises.push(await uploader(path, id));

            fs.unlink('./' + path, (err) => {
                if (err) console.log(err);
            });

            Promise.all(promises).then(function () {
                // returned data is in arguments[0], arguments[1], ... arguments[n]
                imgName = arguments[0][0].public_id;
                img = arguments[0][0].url;

                //perform update operation on the last loop
                performUpdate(res, req.params.id, title, imgName, img, album_name, album_title, next);
            });

        } catch (err) {
            next(err)
        }
    }
};

exports.photoalbum_delete = async (req, res, next) => {
    let photo = null;

    PhotoAlbum.findById(req.params.id, function (err, photoalbum) {
        if (err) return next(err);
        photo = photoalbum;
    });

    PhotoAlbum.deleteOne({_id: new mongodb.ObjectID(req.params.id)}, async function (err, data) {
        if (err) return next(err);
        try {
            let promises = [];
            const uploader = async (id) => await cloudinary.delete(id);

            let id = photo.imgName;

            promises.push(await uploader(id));

            Promise.all(promises).then(function () {
                // returned data is in arguments[0], arguments[1], ... arguments[n]
                res.send('Deleted successfully!');
            });

        } catch (err) {
            next(err)
        }

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
