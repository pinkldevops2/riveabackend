const db = require("../models");
const Gallery = db.gallery;

exports.getGallery = async (req, res, next) => {
    try {
        let { page = 1, limit = 10, sortColumn = "order", sortOrder = "asc" } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);
        const sortOrderValue = sortOrder === "asc" ? 1 : -1;

        // Get total count
        const total = await Gallery.countDocuments();

        // Fetch paginated & sorted users
        const data = await Gallery.find()
        .sort({ [sortColumn]: sortOrderValue })
        .skip((page - 1) * limit)
        .limit(limit);

        res.json({ data, total });
    } catch (error) {
        next(error);
    }
}

exports.getGalleryEntry = async (req, res, next) =>{
    try {
        const gallery = await Gallery.findById(Object(req.params.id))

        if(!gallery) {
            return res.status(401).json({
                success: false,
                error: `Gallery not found with id of ${req.params.id}`
            })
        }
        res.status(200).json({
            success: true,
            data: gallery
        })
    } catch (error) {
        next(error)
    }
}

exports.deleteGalleryEntry = async (req, res, next) => {
    try {
        const entry = await Gallery.findById(req.params.id)

        if (!entry){
            return res.status(404).json({
                success: false,
                error: `Gallery not found with id of ${req.params.id}`
            })
        }
        await entry.deleteOne()
        res.status(200).json({
            success: true,
            data: {}
        })
    } catch (error) {
        next(error)
    }
}

exports.createGallery = async (req, res, next) => {
    try {
        if (req.body.type == 'image') {
            if (req.files['file'][0] != undefined && req.files['file'][0].path) {
                const filePath = req.files['file'][0].path;
                  if (filePath) {
                    req.body.image = filePath
                }
            }
        }
        if (req.body.type == "video") {
            if (req.files['video'][0] != undefined && req.files['video'][0].path) {
                const videoPath = req.files['video'][0].path;
                  if (videoPath) {
                    req.body.video = videoPath
                }
            }
            if (req.files['videoPoster'][0] != undefined && req.files['videoPoster'][0].path) {
                const posterPath = req.files['videoPoster'][0].path;
                  if (posterPath) {
                    req.body.videoPoster = posterPath
                }
            }
        }
        const GalleryData = await Gallery.create(req.body)

        res.status(201).json({
            success: true,
            message: "Form submitted successfully."
        })
    
    } catch (error) {
        next(error)
    }
}
exports.updateGallery = async (req, res, next) => {
    try {
        let GalleryData = await Gallery.findById(req.params.id)

        if(!GalleryData){
            return res.status(401).json({
                success: false,
                error: `Gallery not found with id ${req.params.id}`
            })
        }
        if (req.body.type == 'image') {
            if (req.files['file'] != undefined && req.files['file'][0].path) {
                const filePath = req.files['file'][0].path;
                  if (filePath) {
                    req.body.image = filePath
                }
            }
        }
        if (req.body.type == "video") {
            if (req.files['video'] != undefined && req.files['video'][0].path) {
                const videoPath = req.files['video'][0].path;
                  if (videoPath) {
                    req.body.video = videoPath
                }
            }
            if (req.files['videoPoster'] != undefined && req.files['videoPoster'][0].path) {
                const posterPath = req.files['videoPoster'][0].path;
                  if (posterPath) {
                    req.body.videoPoster = posterPath
                }
            }
        }
        GalleryData = await Gallery.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            success: true,
            data: GalleryData
        })
    } catch (error) {
        next(error)
    }
}

exports.getGalleryFrontend = async (req, res, next) => {
    try {
        let { page = 1, limit = 5, sortColumn = "type", sortOrder = "asc" } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);
        const sortOrderValue = sortOrder === "asc" ? 1 : -1;

        // Pagination
        const data = await Gallery.find()
            .sort({ [sortColumn]: sortOrderValue })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));

        const total = await Gallery.countDocuments();

        res.status(200).json({ data, total });
    } catch (error) {
        next(error);
    }
}