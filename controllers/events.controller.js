const Events = require('../models/events.model');
var fs = require('fs');
var path = require('path');
let mongodb = require('mongodb');


exports.events_create = async (req, res, next) => {
    // let title = req.body.title.toString().toString().split(",").pop();

        let events = new Events(
            {
                event_name: req.body.event_name.toString().split(",").pop(),
                event_desc: req.body.event_desc.toString().split(",").pop(),
                event_imgName: req.file.filename,
                event_imgPath: req.file.path,
                start_date:  req.body.start_date.toString().split(",").pop(),
                end_date: req.body.end_date.toString().split(",").pop(),
                start_time: req.body.start_time.toString().split(",").pop(),
                end_time: req.body.end_time.toString().split(",").pop(),
                scheduleType: parseInt(req.body.scheduleType),
                event_recur: req.body.event_recur
            }
        );

        console.log(events);

        events.save(function (err, events) {
            if (err) {
                return next(err);
            }
            // else if (events)
            //     return events._id;
            // console.log(events._id);
            // //     res.json({events});
        });
    res.send(events)
};

exports.events_all = function (req, res, next) {
    Events.find(({}), function (err, events) {
        if (err) return next(err);
        res.send(events);
    });
};

exports.events_details = function (req, res, next) {
    Events.findById(req.params.id, function (err, events) {
        if (err) return next(err);
        res.send(events);
    })
};

exports.events_update = function (req, res, next) {
    const event_name =  req.body.event_name.toString().split(",").pop();
    const event_desc = req.body.event_desc.toString().split(",").pop();
    const start_date =  req.body.start_date.toString().split(",").pop();
    const end_date = req.body.end_date.toString().split(",").pop();
    const start_time = req.body.start_time.toString().split(",").pop();
    const end_time = req.body.end_time.toString().split(",").pop();
    const event_recur = req.body.event_recur;
    const scheduleType = parseInt(req.body.scheduleType);
    //
    console.log(req.body.event_imgPath)
    let img = req.body.event_imgPath.toString().slice( 1 );
    console.log(img)
    // img = img;
    let imgName = req.body.event_imgName.toString();
    console.log(img);
    if(req.file) {
        //unlink or delete image in folder gallery
        fs.unlinkSync(path.join("assets/image/gallery/", req.body.event_imgName));

        img = req.file.path;
        imgName = req.file.filename;
    }
    //
    Events.updateMany({"_id": req.params.id}, {
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
};

exports.events_delete = function (req, res, next) {
    Events.findByIdAndRemove (req.params.id, function (err, events) {
    // Events.deleteOne({_id: new mongodfindByIdAndRemoveb.ObjectID(req.params.id)}, function(err, events){
        console.log(events);
        if (err) return next(err);
        res.send(events);
    })
};
