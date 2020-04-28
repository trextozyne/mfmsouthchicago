
const cloudinary =  require('cloudinary').v2;
const dotenv =  require('dotenv');

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploads = (imagePath, folder) => {
         return cloudinary.uploader.upload(imagePath,
            {
                resource_type: "auto",
                folder: folder
            },
            function(error, result) {
                if (error) {
                    // handle error
                } else {
                    // console.log(result);
                    // return result
                    return Promise.resolve({
                        url: result.url,
                        id: result.public_id
                    })
                }
            });
};

exports.updates = (imagePath, _id, folder) => {//.substring(_id.indexOf("/") + 1)
    _id = _id.substring(_id.indexOf("/") + 1);

    return cloudinary.uploader.upload(imagePath,
        {
            resource_type: "auto",
            folder: folder,
            public_id: _id,
            overwrite:true,
            invalidate:true
        },
        function(error, result) {
            if (error) {
                // handle error
            } else {
                return Promise.resolve({
                    url: result.url,
                    id: result.public_id
                })
            }
        });
};