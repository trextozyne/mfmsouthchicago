
const Verse = require('../models/verse.model');
var fs = require('fs');
const mongoose = require('mongoose');
const conn = mongoose.connection;
var path = require('path');
let mongodb = require('mongodb');


exports.verse_create = async (req, res, next) => {
    console.log(req.body.verse);
        let verse = new Verse(
            {
                chapter: req.body.chapter,
                verse: req.body.verse
            }
        );

        verse.save(function (err, verse) {
            if (err) {
                return next(err);
            }
        });
    res.send(verse._id)
};

exports.verse_all = function (req, res, next) {
    Verse.find(({}), function (err, verse) {
        if (err) return next(err);
        res.send(verse);
    });
};

exports.verse_details = function (req, res, next) {
    Verse.findById(req.params.id, function (err, verse) {
        if (err) return next(err);
        res.send(verse);
    })
};

exports.verse_update = function (req, res, next) {
    const chapter =  req.body.chapter;
    const verse =  req.body.verse;

    Verse.updateMany({"_id": req.params.id}, {
        $set: {
            "chapter" : chapter,
            "verse" : verse
        }
    },{multi: true}, function (err, verse) {
        if (err) return next(err);
        res.send(req.body._id);
    });
};

exports.verse_delete = function (req, res, next) {
    Verse.findByIdAndRemove (req.params.id, function (err, verse) {
        console.log(verse);
        if (err) return next(err);
        res.send(verse);
    })
};

exports.verse_collection_drop = function (req, res, next) {
    let verses = conn.db.collection('verses');
    verses.drop();
    res.send("dropped");
};