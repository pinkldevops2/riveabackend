const db = require("../models");
const CaseStudies = db.casestudies;

exports.getCaseStudies = async (req, res, next) => {
    try {
        let { search = '', page = 1, limit = 10, sortColumn = "name", sortOrder = "asc" } = req.query;
        let query = {};
        page = parseInt(page);
        limit = parseInt(limit);
        const sortOrderValue = sortOrder === "asc" ? 1 : -1;
        if (search) {
            query.$or = [
                {title: {$regex: search, $options: "i"}},
                {subTitle: {$regex: search, $options: "i"}},
                {slug: {$regex: search, $options: "i"}},
            ]
        }
        // Get total count
        const total = await CaseStudies.countDocuments(query);

        // Fetch paginated & sorted users
        const data = await CaseStudies.find(query)
        .sort({ [sortColumn]: sortOrderValue })
        .skip((page - 1) * limit)
        .limit(limit);

        res.json({ data, total });
    } catch (error) {
        next(error);
    }
}

exports.getCaseStudyFrontend = async (req, res, next) => {
    try {
        let { search, category_id, type_id, page = 1, limit = 5, sortColumn = "title", sortOrder = "asc" } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);
        const sortOrderValue = sortOrder === "asc" ? 1 : -1;
        let query = {};

        if (search) {
            let escapeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            query.$or = [
            { title: { $regex: escapeSearch, $options: "i" } },
            { subTitle: { $regex: escapeSearch, $options: "i" } },
            ];
        }

        // Apply filters
        if (category_id) query.category_id = category_id;
        if (type_id){
            let escapeType = type_id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            query.type_id = escapeType;
        }
        // Pagination
        const data = await CaseStudies.find(query)
            .sort({ [sortColumn]: sortOrderValue })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));

        const total = await CaseStudies.countDocuments(query);

        res.status(200).json({ data, total });
    } catch (error) {
        next(error);
    }
}

exports.getCaseStudyEntry = async (req, res, next) =>{
    try {
        const case_study = await CaseStudies.findById(Object(req.params.id))

        if(!case_study) {
            return res.status(401).json({
                success: false,
                error: `case study not found with id of ${req.params.id}`
            })
        }
        res.status(200).json({
            success: true,
            data: case_study
        })
    } catch (error) {
        next(error)
    }
}

exports.deleteCaseStudyEntry = async (req, res, next) => {
    try {
        const entry = await CaseStudies.findById(req.params.id)

        if (!entry){
            return res.status(404).json({
                success: false,
                error: `Case Study not found with id of ${req.params.id}`
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

exports.createCaseStudy = async (req, res, next) => {
    try {
        if (req.file != undefined && req.file.path) {
            const filePath = req.file.path; // Path to the uploaded CSV file
            
            
              if (filePath) {
                req.body.image = filePath
            }
        }
        const CaseStudyData = await CaseStudies.create(req.body)

        res.status(201).json({
            success: true,
            message: "Form submitted successfully."
        })
    
    } catch (error) {
        next(error)
    }
}
exports.updateCaseStudy = async (req, res, next) => {
    try {
        let CaseStudyData = await CaseStudies.findById(req.params.id)

        if(!CaseStudyData){
            return res.status(401).json({
                success: false,
                error: `Case Study not found with id ${req.params.id}`
            })
        }
        if (req.file != undefined && req.file.path) {
            const filePath = req.file.path; // Path to the uploaded CSV file
            
            
              if (filePath) {
                req.body.image = filePath
            }
        }
        CaseStudyData = await CaseStudies.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            success: true,
            data: CaseStudyData
        })
    } catch (error) {
        next(error)
    }
}

exports.getCaseStudyBySlug = async (req, res, next) =>{
    try {
        let query = {}
        query.slug = req.params.slug;
        const caseStudy = await CaseStudies.findOne(query);
        let previous = null;
        let next = null;
        if(caseStudy){
            // Get previous blog (newer post)
            previous = await CaseStudies.findOne({
            createdAt: { $gt: caseStudy.createdAt }
            })
            .sort({ createdAt: 1 })
            .select('slug');

            // Get next blog (older post)
            next = await CaseStudies.findOne({
            createdAt: { $lt: caseStudy.createdAt }
            })
        .sort({ createdAt: -1 })
        .select('slug');
        }
        if(!caseStudy) {
            return res.status(401).json({
                success: false,
                error: `Case Study not found with id of ${req.params.id}`
            })
        }
        res.status(200).json({
            success: true,
            data: caseStudy,
            next: next ? next.slug : null,
            previous: previous ? previous.slug : null
        })
    } catch (error) {
        next(error)
    }
}

exports.getCaseStudyMetaBySlug = async (req, res, next) =>{
    try {
        let query = {}
        query.slug = req.params.slug;
        const caseStudy = await CaseStudies.findOne(query,{metaTitle: 1, metaDescription: 1});
        if(!caseStudy) {
            return res.status(401).json({
                success: false,
                error: `case study not found with id of ${req.params.id}`
            })
        }
        res.status(200).json({
            success: true,
            data: caseStudy
        })
    } catch (error) {
        next(error)
    }
}