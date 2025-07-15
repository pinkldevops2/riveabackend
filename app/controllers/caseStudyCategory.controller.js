const db = require("../models");
const CaseStudyCategories = db.casestudycategories;

exports.getCategories = async (req, res, next) => {
    try {
        let { search = '', page = 1, limit = 10, sortColumn = "name", sortOrder = "asc" } = req.query;
        let query = {};
        page = parseInt(page);
        limit = parseInt(limit);
        const sortOrderValue = sortOrder === "asc" ? 1 : -1;
        if (search) {
            query = {name: {$regex: search, $options: "i" } };
        }
        const total = await CaseStudyCategories.countDocuments(query);

        const data = await CaseStudyCategories.find(query)
        .sort({ [sortColumn]: sortOrderValue })
        .skip((page - 1) * limit)
        .limit(limit);

        res.json({ data, total });
    } catch (error) {
        next(error);
    }
}

/*exports.getCategoryFronted = async (req, res, next) => {
    try {
        const { search, page = 1, limit = 5, sortColumn = "name", sortOrder = "asc" } = req.query;

        const sortOrderValue = sortOrder === "asc" ? 1 : -1;
        let query = {};
        if (search) {
            let escapeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            query.name = { $regex: escapeSearch, $options: "i" };
        }

        // Pagination
        
        const data = await CaseStudyCategories.find(query)
            .sort({ [sortColumn]: sortOrderValue })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));

        const total = await CaseStudyCategories.countDocuments(query);

        res.status(200).json({ data, total });
    } catch (error) {
        next(error);
    }
}*/

exports.getCategoriesEntry = async (req, res, next) =>{
    try {
        const categories = await CaseStudyCategories.findById(Object(req.params.id))

        if(!categories) {
            return res.status(401).json({
                success: false,
                error: `Case-Study category not found with id of ${req.params.id}`
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
        const entry = await CaseStudyCategories.findById(req.params.id)

        if (!entry){
            return res.status(404).json({
                success: false,
                error: `Case-Study category not found with id of ${req.params.id}`
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
        const categoryData = await CaseStudyCategories.create(req.body)

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
        let categoryData = await CaseStudyCategories.findById(req.params.id)

        if(!categoryData){
            return res.status(401).json({
                success: false,
                error: `Case-Study category not found with id ${req.params.id}`
            })
        }
        categoryData = await CaseStudyCategories.findByIdAndUpdate(req.params.id, req.body, {
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

exports.getAllCaseStudyCategoryFrontend = async (req, res, next) => {
    try {
        let { sortColumn = "name", sortOrder = "asc" } = req.query;

        const sortOrderValue = sortOrder === "asc" ? 1 : -1;

        // Get total count
        const total = await CaseStudyCategories.countDocuments();

        // Fetch paginated & sorted users
        const data = await CaseStudyCategories.find()
        .sort({ [sortColumn]: sortOrderValue });

        res.json({ data, total });
    } catch (error) {
        next(error);
    }
}


exports.getCategoriesByType = async (req, res, next) => {
    try {
        let query = {};
        if (req.params.type) {
            query.typeId = { $regex: req.params.type, $options: "i" };
        }
        const categories = await CaseStudyCategories.find(query);
        if(!categories) {
            return res.status(401).json({
                success: false,
                error: `Case-Study category not found with id of ${req.params.id}`
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