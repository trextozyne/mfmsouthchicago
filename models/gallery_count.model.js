const mongoose = require('mongoose');
const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
//{type: Date, required: true}
let GalleryCountSchema = new Schema({
        quantity: 'number'
    }
    ,{
        timestamps: true
    });

GalleryCountSchema.virtual('galleryCountId').get(function(){
    return this._id;
});


// Export the model
module.exports = mongoose.model('GalleryCount', GalleryCountSchema);