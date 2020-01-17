const mongoose = require('mongoose');
const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
//{type: Date, required: true}
let PhotoAlbumSchema = new Schema({
    title: String,
    img: String,
    imgName: String,
    albums:[
             {
                 u_name: String,
                 u_title: String
             }]
    }
    ,{
      timestamps: true
});

PhotoAlbumSchema.virtual('pictureId').get(function(){
    return this._id;
});


// Export the model
module.exports = mongoose.model('PhotoAlbum', PhotoAlbumSchema);
