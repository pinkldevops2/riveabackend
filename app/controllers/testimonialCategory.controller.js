const db = require("../models");
const TestimonialCategories = db.testimonialcategories

exports.getCategories = async (req, res, next) => {
    try {
        let { search = '', page = 1, limit = 10, sortColumn = "name", sortOrder = "asc" } = req.query;
        let query = {};
        page = parseInt(page);
        limit = parseInt(limit);
        const sortOrderValue = sortOrder === "asc" ? 1 : -1;
        if (search) {
            query = {name: {$regex: search, $options: "i"} }
        }
        const total = await TestimonialCategories.countDocuments(query);

        const data = await TestimonialCategories.find(query)
        .sort({ [sortColumn]: sortOrderValue })
        .skip((page - 1) * limit)
        .limit(limit);

        res.json({ data, total });
    } catch (error) {
        next(error);
    }
}

exports.getTestimonialCategories = async (req, res, next) => {
    try {
        let { sortColumn = "name", sortOrder = "asc" } = req.query;

        const sortOrderValue = sortOrder === "asc" ? 1 : -1;

        const total = await TestimonialCategories.countDocuments();

        const data = await TestimonialCategories.find()
        .sort({ [sortColumn]: sortOrderValue });
        res.json({ data, total });
    } catch (error) {
        next(error);
    }
}

exports.getCategoryFronted = async (req, res, next) => {
    try {
        const { search, page = 1, limit = 5, sortColumn = "name", sortOrder = "asc" } = req.query;

        const sortOrderValue = sortOrder === "asc" ? 1 : -1;
        let query = {};
        if (search) {
            let escapeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            query.name = { $regex: escapeSearch, $options: "i" };
        }

        // Pagination
        
        const data = await TestimonialCategories.find(query)
            .sort({ [sortColumn]: sortOrderValue })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));

        const total = await TestimonialCategories.countDocuments(query);

        res.status(200).json({ data, total });
    } catch (error) {
        next(error);
    }
}

exports.getCategoriesEntry = async (req, res, next) =>{
    try {
        const categories = await TestimonialCategories.findById(Object(req.params.id))

        if(!categories) {
            return res.status(401).json({
                success: false,
                error: `Testimonial category not found with id of ${req.params.id}`
            })
        }
        res.status(200).json({
            success: true,
            data: categories
        })
    } catch (error) {
        next(error)
    }
}

exports.deleteCategoryEntry = async (req, res, next) => {
    try {
        const entry = await TestimonialCategories.findById(req.params.id)

        if (!entry){
            return res.status(404).json({
                success: false,
                error: `Testimonial category not found with id of ${req.params.id}`
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

exports.createCategory = async (req, res, next) => {
    try {
        const categoryData = await TestimonialCategories.create(req.body)

        res.status(201).json({
            success: true,
            message: "Form submitted successfully."
        })
    
    } catch (error) {
        next(error)
    }
}
exports.updateCategory = async (req, res, next) => {
    try {
        let categoryData = await TestimonialCategories.findById(req.params.id)

        if(!categoryData){
            return res.status(401).json({
                success: false,
                error: `Testimonial category not found with id ${req.params.id}`
            })
        }
        categoryData = await TestimonialCategories.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            success: true,
            data: categoryData
        })
    } catch (error) {
        next(error)
    }
}