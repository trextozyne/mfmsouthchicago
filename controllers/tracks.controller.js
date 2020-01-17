
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const conn = mongoose.connection;
const MongoClient = require('mongodb').MongoClient;
const ObjectID = mongodb.ObjectID;
var fs = require('fs');
var assert = require('assert');

/**
 * NodeJS Module dependencies.
 */
const { Readable } = require('stream');

/**
 * POST /tracks
 */
exports.tracks_create =  (req, res) => {
    console.log(req.body);
    let trackNmae = req.body.name;

    // Covert buffer to Readable Stream
    const readableTrackStream = new Readable();
    readableTrackStream.push(req.file.buffer);
    readableTrackStream.push(null);

    let bucket = new mongodb.GridFSBucket(conn.db, {
        bucketName: 'tracks'
    });

    let uploadStream = bucket.openUploadStream(trackName, {chunkSizeBytes:null, metadata:{speaker: req.body.speaker, duration: req.body.duration}, contentType: null, aliases: null});

    let id = uploadStream.id;
    readableTrackStream.pipe(uploadStream);

    uploadStream.on('error', () => {
        return res.status(500).json({message: "Error uploading file"});
    });

    uploadStream.on('finish', () => {
        return res.status(201).json({message: "File uploaded successfully, stored under Mongo ObjectID: " + id});
    });
    // })
};

/**
 * GET /tracks/:trackID
 */

exports.tracks_all = function (req, res, next) {
    let collection = conn.db.collection('tracks.files');
    collection.find().toArray(function (err, docs) {
        res.send(docs);
    });

};
/**
 * GET /tracks/:trackID
 */

exports.tracks_details = function (req, res, next) {

    let trackID;

    try {
        trackID = new ObjectID(req.params.trackID);
    } catch (err) {
        return res.status(400).json({message: "Invalid trackID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters"});
    }
    // console.log(req.params);
    res.set('content-type', 'audio/mp3');
    res.set('accept-ranges', 'bytes');

    let bucket = new mongodb.GridFSBucket(conn.db, {
        bucketName: 'tracks'
    });

    // console.log(bucket);

    let downloadStream = bucket.openDownloadStream(trackID);

    downloadStream.on('data', (chunk) => {
        res.write(chunk);
    });

    downloadStream.on('error', () => {
        res.sendStatus(404);
    });

    downloadStream.on('end', () => {
        res.end();
    });
    // })
};

exports.tracks_delete_single = (req, res, next)=> {
    let fileID;

    try {
        fileID = ObjectID(req.params.fileID);
    } catch (err) {
        return res.status(400).json({message: "Invalid fileID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters"});
    }

    let bucket = new mongodb.GridFSBucket(conn.db, {
        bucketName: 'tracks'
    });

// Delete file
    bucket.delete(fileID, function(err, result2) {
        assert.equal(null, err);
        res.send('Deleted successfully')
    });
};

exports.tracks_delete_all = (req, res, next)=> {
    let fileID;

    try {
        fileID = ObjectID(req.params.fileID);
    } catch (err) {
        return res.status(400).json({message: "Invalid fileID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters"});
    }

    let bucket = new mongodb.GridFSBucket(conn.db, {
        bucketName: 'tracks'
    });


    bucket.drop(function(err, result2) {
        assert.equal(null, err);
        res.send('Deleted successfully')
    });
};


exports.tracks_download = function (req, res, next) {

    let trackID;

    try {
        trackID = new ObjectID(req.params.trackID);
    } catch (err) {
        return res.status(400).json({message: "Invalid trackID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters"});
    }
    console.log(req.params);
    res.setHeader('Content-disposition', 'attachment; filename=' + trackID + '.mp3');
    res.setHeader('Content-Type', 'application/audio/mpeg');

    let bucket = new mongodb.GridFSBucket(conn.db, {
        bucketName: 'tracks'
    });

    // console.log(bucket);

    let downloadStream = bucket.openDownloadStream(trackID);

    downloadStream.on('data', (chunk) => {
        res.write(chunk);
    });

    downloadStream.on('error', () => {
        res.sendStatus(404);
    });

    downloadStream.on('end', () => {
        res.end();
    });
    // })
};


