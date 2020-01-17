const Gallery_Count = require('../models/gallery_count.model');
var fs = require('fs');
let mongodb = require('mongodb');
var path = require('path');


exports.gallery_count_create = async (req, res, next) => {

    let gallery_count = new Gallery_Count(
        {
            quantity: req.body.quantity
        }
    );

    gallery_count.save(function (err) {
        if (err) {
            return next(err);
        }
    })
    res.send(gallery_count._id)
};

exports.gallery_count_all = function (req, res, next) {
    Gallery_Count.find({}, function (err, gallery_count) {
        if (err) return next(err);
        console.log(gallery_count);
        res.send(gallery_count);
    });
};

exports.gallery_count_details = function (req, res, next) {
    Gallery_Count.findById(req.params.id, function (err, gallery_count) {
        if (err) return next(err);
        res.send(gallery_count);
    })
};

exports.gallery_count_update = function (req, res, next) {
    Gallery_Count.updateOne(
        { "_id": req.params.id}, // Filter
        {$set: {"quantity": req.body.quantity}}, // Update
        {upsert: true} // add document with req.body._id if not exists

    ).then((obj) => {
            console.log('Updated - ' + obj);
            // res.redirect('orders')
        })
        .catch((err) => {
            console.log('Error: ' + err);
        })
};

exports.gallery_count_delete = function (req, res, next) {
    // Gallery_Count.findOneAndDelete (req.params.id, function (err) {
    Gallery_Count.deleteOne({_id: new mongodb.ObjectID(req.params.id)}, function(err, events){
        if (err) return next(err);
        res.send('Deleted successfully!');
    })
};
//Simple version, without validation or sanitation
exports.test = function (req, res) {
    res.send('Greetings from the Test controller!');
};

// empty the collection
// Gallery_Count.remove(err => {
//     if (err) throw err;
//     console.log("Removed all documents in 'Gallery_Count' collection.");
