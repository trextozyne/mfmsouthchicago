
const YTPlaylist = require('../models/ytplayList.model');
var fs = require('fs');
const mongoose = require('mongoose');
const conn = mongoose.connection;
let path = require('path');
let mongodb = require('mongodb');


exports.ytplayList_create = async (req, res, next) => {
        let ytplayList = new YTPlaylist(
            {
                playlisttiltle: req.body.playlisttiltle,
                playlistid: req.body.playlistid
            }
        );

        ytplayList.save(function (err, ytplayList) {
            if (err) {
                return next(err);
            }
        });

    res.send(ytplayList._id)
};

exports.ytplayList_all = function (req, res, next) {
    YTPlaylist.find(({}), function (err, ytplayList) {
        if (err) return next(err);
        res.send(ytplayList);
    });
};

exports.ytplayList_details = function (req, res, next) {
    YTPlaylist.findById(req.params.id, function (err, ytplayList) {
        if (err) return next(err);
        res.send(ytplayList);
    })
};

exports.ytplayList_update = function (req, res, next) {
    const playlisttiltle =  req.body.playlisttiltle;
    const playlistid =  req.body.playlistid;

    YTPlaylist.updateMany({"_id": req.params.id}, {
        $set: {
            "playlisttiltle" : playlisttiltle,
            "playlistid" : playlistid
        }
    },{multi: true}, function (err, ytplayList) {
        if (err) return next(err);
        res.send(req.body._id);
    });
};

exports.ytplayList_delete = function (req, res, next) {
    YTPlaylist.findByIdAndRemove (req.params.id, function (err, ytplayList) {
        console.log(ytplayList);
        if (err) return next(err);
        res.send(ytplayList);
    })
};

exports.ytplayList_collection_drop = function (req, res, next) {
    let ytplayLists = conn.db.collection('ytplayLists');
    ytplayLists.drop();
    res.send("dropped");
};