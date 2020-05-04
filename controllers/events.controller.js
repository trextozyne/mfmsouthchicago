let query = require("mongoose");

const Events = require('../models/events.model');
var fs = require('fs');
var path = require('path');
const cloudinary =  require('../config/cloudinaryConfig');
let mongodb = require('mongodb');


exports.events_create = async (req, res, next) => {
    // let title = req.body.title.toString().toString().split(",").pop();

        let events = new Events(
            {
                event_name: req.body.event_name.toString().split(",").pop(),
                event_desc: req.body.event_desc.toString().split(",").pop(),
                start_date:  req.body.start_date.toString().split(",").pop(),
                end_date: req.body.end_date.toString().split(",").pop(),
                start_time: req.body.start_time.toString().split(",").pop(),
                end_time: req.body.end_time.toString().split(",").pop(),
                scheduleType: parseInt(req.body.scheduleType),
                event_recur: req.body.event_recur
            }
        );

        try {
            let promises = [];
            const uploader = async (path) => await cloudinary.uploads(path, 'Event-Images');

            const {path} = req.file;
            // console.log(path);

            promises.push(await uploader(path));

            fs.unlink('./' + path, (err) => {
                if (err) console.log(err);
            });

            Promise.all(promises).then(function () {
                // returned data is in arguments[0], arguments[1], ... arguments[n]
                events.event_imgName = arguments[0][0].public_id;
                events.event_imgPath = arguments[0][0].url;

                //perform save operation on the last loop
                events.save(function (err) {
                    if (err) {
                        return next(err);
                    }
                });
                res.send(events)
            });
        } catch (err) {
            next(err);
        }

        // console.log(events);
};

exports.events_all = function (req, res, next) {
    // let itemsPerPage = 10;
    // console.log(req.params.pageNum);
    try {
        Events.find(({}), function (err, events) {//query
            if (err) return next(err);
            console.log(events)
            res.send(events);
        });
    }catch (e) {
        next(e)
    }
};

exports.events_details = function (req, res, next) {
    Events.findById(req.params.id, function (err, events) {
        if (err) return next(err);

        res.send(events);
    })
};

function performUpdate(req, res, id, event_name, event_desc, imgName, img, start_date, end_date, start_time,
                       end_time, scheduleType, event_recur, next) {
    Events.updateMany({"_id": id}, {
        $set: {
            "event_name" : event_name,
            "event_desc" : event_desc,
            "event_imgName" : imgName,
            "event_imgPath" : img,
            "start_date" :  start_date,
            "end_date" : end_date,
            "start_time" : start_time,
            "end_time" : end_time,
            "scheduleType" :scheduleType,
            "event_recur": event_recur
            //
        }
    },{multi: true}, function (err, events) {
        if (err) return next(err);
        res.send(req.body);
    });
}

exports.events_update = async (req, res, next) => {
    // console.log(req.body)
    const event_name =  req.body.event_name;
    const event_desc = req.body.event_desc;
    const start_date =  req.body.start_date;
    const end_date = req.body.end_date;
    const start_time = req.body.start_time;
    const end_time = req.body.end_time;
    const event_recur = req.body.event_recur;
    const scheduleType = parseInt(req.body.scheduleType);

    let img = req.body.event_imgPath;
    let imgName = req.body.event_imgName;

    if(!req.file) {
        //perform update operation on the last loop
        performUpdate(req, res, req.params.id, event_name, event_desc, imgName, img, start_date, end_date,
            start_time, end_time, scheduleType, event_recur, next);
    } else {
        try {
            let promises = [];
            const uploader = async (path, _id) => await cloudinary.updates(path, _id, 'Event-Images');

            const {path} = req.file;

            let id = req.body.event_imgName;
            promises.push(await uploader(path, id));

            fs.unlink('./' + path, (err) => {
                if (err) console.log(err);
            });

            Promise.all(promises).then(function () {
                // returned data is in arguments[0], arguments[1], ... arguments[n]
                imgName = arguments[0][0].public_id;
                img = arguments[0][0].url;

                //perform update operation on the last loop
                performUpdate(req, res, req.params.id, event_name, event_desc, imgName, img, start_date, end_date,
                    start_time, end_time, scheduleType, event_recur, next);
            });

        } catch (err) {
            next(err)
        }
    }
    // if(req.file) {
    //     //unlink or delete image in folder gallery
    //     fs.unlinkSync(path.join("assets/image/gallery/", req.body.event_imgName));
    //
    //     img = req.file.path;
    //     imgName = req.file.filename;
    // }
};

exports.events_delete = async (req, res, next) => {
    let event = null;

    Events.findById(req.params.id, function (err, events) {
        if (err) return next(err);
        event = events;
    });

    // Events.findByIdAndRemove (req.params.id, async function (err, data) {
    Events.deleteOne({_id: new mongodb.ObjectID(req.params.id)}, async function(err, data){
        if (err) return next(err);

        try {
            let promises = [];
            const uploader = async (_id) => await cloudinary.delete(_id);

            let id = event.event_imgName;
            promises.push(await uploader(id));

            Promise.all(promises).then(function () {
                res.send(event);
            });

        } catch (err) {
            next(err)
        }
    })
};
