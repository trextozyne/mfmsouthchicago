
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
 * POST /files
 */
exports.files_create =  (req, res) => {
    console.log(req.body.filename[0]);
    let fileName = req.body.filename[0];

    // Covert buffer to Readable Stream
    const readableFileStream = new Readable();
    readableFileStream.push(req.file.buffer);
    readableFileStream.push(null);

    let bucket = new mongodb.GridFSBucket(conn.db, {
        bucketName: 'files'
    });

    let uploadStream = bucket.openUploadStream(fileName, {chunkSizeBytes:null, metadata:null, contentType: null, aliases: null});

    let id = uploadStream.id;
    readableFileStream.pipe(uploadStream);

    uploadStream.on('error', () => {
        return res.status(500).json({message: "Error uploading file"});
    });

    uploadStream.on('finish', () => {
        return res.status(201).json({message: "File uploaded successfully, stored under Mongo ObjectID: " + id});
    });
    // })
};

/**
 * GET /files/:fileID
 */

exports.files_all = function (req, res, next) {
    let collection = conn.db.collection('files.files');
    collection.find().toArray(function (err, docs) {
        res.send(docs);
    });

};
/**
 * GET /files/:fileID
 */

exports.files_details = function (req, res, next) {

    let fileID;

    try {
        fileID = ObjectID(req.params.fileID);
    } catch (err) {
        return res.status(400).json({message: "Invalid fileID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters"});
    }
    // console.log(req.params);
    res.set('content-type', 'application/pdf');
    res.set('accept-ranges', 'bytes');

    let bucket = new mongodb.GridFSBucket(conn.db, {
        bucketName: 'files'
    });

    // console.log(bucket);

    let downloadStream = bucket.openDownloadStream(fileID);

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

exports.files_delete_single = (req, res, next)=> {
    let fileID;

    try {
        fileID = ObjectID(req.params.fileID);
} catch (err) {
    return res.status(400).json({message: "Invalid fileID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters"});
}

let bucket = new mongodb.GridFSBucket(conn.db, {
    bucketName: 'files'
});

// Delete file
    bucket.delete(fileID, function(err, result2) {
        assert.equal(null, err);
        res.send('Deleted successfully')
    });
};

exports.files_delete_all = (req, res, next)=> {
    let fileID;

    try {
        fileID = ObjectID(req.params.fileID);
    } catch (err) {
        return res.status(400).json({message: "Invalid fileID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters"});
    }

    let bucket = new mongodb.GridFSBucket(conn.db, {
        bucketName: 'files'
    });


    bucket.drop(function(err, result2) {
        assert.equal(null, err);
        res.send('Deleted successfully')
    });
};

exports.files_download = function (req, res, next) {

    let fileID;

    try {
        fileID = new ObjectID(req.params.fileID);
    } catch (err) {
        return res.status(400).json({message: "Invalid fileID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters"});
    }
    console.log(req.params);
    res.setHeader('Content-disposition', 'attachment; filename=' + fileID + '.pdf');
    res.setHeader('Content-Type', 'application/pdf');

    let bucket = new mongodb.GridFSBucket(conn.db, {
        bucketName: 'files'
    });

    // console.log(bucket);

    let downloadStream = bucket.openDownloadStream(fileID);

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


