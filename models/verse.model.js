const mongoose = require('mongoose');
const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
//{type: Date, required: true}
let VerseScheme = new Schema({
        chapter: String,
        verse: String
    }
    ,{
        timestamps: true
    });

VerseScheme.virtual('verseId').get(function(){
    return this._id;
});


// Export the model
module.exports = mongoose.model('Verse', VerseScheme);