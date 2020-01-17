const mongoose = require('mongoose');
const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
//{type: Date, required: true}
let SlidesSchema = new Schema({
        sliderType: String,
        slider_event_date:  String,
        slider_content1: String,
        slider_content2: String,
        bgImgFilename: String,
        bgImgPath: String,
        img1Filename: String,
        img1Path: String,
        img2Filename: String,
        img2Path: String,
        sliderScheduleType: "number"
    }
    ,{
        timestamps: true
    });

SlidesSchema.virtual('slideId').get(function(){
    return this._id;
});


// Export the model
module.exports = mongoose.model('Slides', SlidesSchema);