const mongoose = require('mongoose');
const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
//{type: Date, required: true}
let YTplayLiveScheme = new Schema({
        ytlivelink: String
    }
    ,{
        timestamps: true
    });

YTplayLiveScheme.virtual('ytplayLiveId').get(function(){
    return this._id;
});


// Export the model
module.exports = mongoose.model('YTplayLive', YTplayLiveScheme);