const db = require("../models");
const Testimonials = db.testimonials;

exports.getTestimonials = async (req, res, next) => {
    try {
        let { search = '', page = 1, limit = 10, sortColumn = "title", sortOrder = "asc" } = req.query;
        let query = {};
        page = parseInt(page);
        limit = parseInt(limit);
        const sortOrderValue = sortOrder === "asc" ? 1 : -1;
        if (search) {
            query = {title: {$regex: search, $options: "i"} };
        }
        // Get total count
        const total = await Testimonials.countDocuments(query);

        // Fetch paginated & sorted users
        const data = await Testimonials.find(query)
        .sort({ [sortColumn]: sortOrderValue })
        .skip((page - 1) * limit)
        .limit(limit);

        res.json({ data, total });
    } catch (error) {
        next(error);
    }
}

exports.getTestimonialsFrontend = async (req, res, next) => {
    try {
        let { search, category_id, page = 1, limit = 5, sortColumn = "title", sortOrder = "asc" } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);
        const sortOrderValue = sortOrder === "asc" ? 1 : -1;
        let query = {};
        // Search by title
        if (search) {
            let escapeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            query.title = { $regex: escapeSearch, $options: "i" };
        }

        // Apply filters
        if (category_id) query.categories = category_id;
        // Pagination
        const testimonials = await Testimonials.find(query)
            .sort({ [sortColumn]: sortOrderValue })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));

        const total = await Testimonials.countDocuments(query);

        res.status(200).json({ testimonials, total });
    } catch (error) {
        next(error);
    }
}

exports.getTestimonialEntry = async (req, res, next) =>{
    try {
        const testimonial = await Testimonials.findById(Object(req.params.id))

        if(!testimonial) {
            return res.status(401).json({
                success: false,
                error: `Testimonial not found with id of ${req.params.id}`
            })
        }
        res.status(200).json({
            success: true,
            data: testimonial
        })
    } catch (error) {
        next(error)
    }
}

exports.deleteTestimonialEntry = async (req, res, next) => {
    try {
        const entry = await Testimonials.findById(req.params.id)

        if (!entry){
            return res.status(404).json({
                success: false,
                error: `Testimonial not found with id of ${req.params.id}`
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

exports.createTestimonial = async (req, res, next) => {
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
        const TestimonialData = await Testimonials.create(req.body)

        res.status(201).json({
            success: true,
            message: "Form submitted successfully."
        })
    
    } catch (error) {
        next(error)
    }
}
exports.updateTestimonial = async (req, res, next) => {
    try {
        let TestimonialData = await Testimonials.findById(req.params.id)

        if(!TestimonialData){
            return res.status(401).json({
                success: false,
                error: `Testimonial not found with id ${req.params.id}`
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
        TestimonialData = await Testimonials.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            success: true,
            data: TestimonialData
        })
    } catch (error) {
        next(error)
    }
}