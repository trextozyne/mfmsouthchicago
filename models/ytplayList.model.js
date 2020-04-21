const mongoose = require('mongoose');
const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
//{type: Date, required: true}
let YTplayListScheme = new Schema({
        playlisttiltle: String,
        playlistid: String
    }
    ,{
        timestamps: true
    });

YTplayListScheme.virtual('ytplayListId').get(function(){
    return this._id;
});


// Export the model
module.exports = mongoose.model('YTplayList', YTplayListScheme);