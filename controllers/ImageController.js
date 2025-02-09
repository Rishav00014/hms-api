const fs = require('fs').promises;
const config = require("../config/config");
const Image = require("../models/Image");
const sharp = require('sharp');
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret
});

const uploadeImage = (async (req, res) => {
    let userId = req.user._id;
    if (!req.file) {
        return res.status(400).send('No files were uploaded.');
    }
    const file = req.file;
    try {
        const buffer = await sharp(file.buffer).jpeg({quality:5}).toBuffer();

        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            }).end(buffer);
        });

        let imageData = new Image({
            image: result.url,
            publicId: result.public_id,
            createdBy: userId
        })
        await imageData.save();
        return res.status(200).json({
            message: "Image uploaded successfully",
            data: imageData
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: "Image upload failed.",
            data: error
        });
    }

});

const deleteformCloudnamry = async (req, res) => {
    try {
        let userId = req.user._id;
        const id = req.params.id;
        await Image.findOneAndDelete({ publicId: id, createdBy: userId })
        const result = await cloudinary.uploader.destroy(id);
        res.status(200).json({
            message: "image deleted successfully",
            success: true,
            data: result
        });
    } catch (error) {
        res.status(400).json({
            message: "image deleted failed",
            success: false,
            data: error
        });
    }
};


const commonController = {
    uploadeImage,
    deleteformCloudnamry
};

module.exports = commonController;