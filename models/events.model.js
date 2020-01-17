const mongoose = require('mongoose');
const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
//{type: Date, required: true}
let EventsSchema = new Schema({
        event_name: String,
        event_desc: String,
        event_imgName: String,
        event_imgPath: String,
        start_date:  String,
        end_date: String,
        start_time: String,
        end_time: String,
        scheduleType: "number",
        event_recur: [{}]
    }
    ,{
        timestamps: true
    });

EventsSchema.virtual('eventId').get(function(){
    return this._id;
});


// Export the model
module.exports = mongoose.model('Events', EventsSchema);