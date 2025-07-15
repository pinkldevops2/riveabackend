const db = require("../models");
const CaseStudyTypes = db.casestudytypes;

exports.getAllCaseStudyType = async (req, res, next) => {
    try {
        let { search = '', page = 1, limit = 10, sortColumn = "name", sortOrder = "asc" } = req.query;
        let query = {};
        page = parseInt(page);
        limit = parseInt(limit);
        const sortOrderValue = sortOrder === "asc" ? 1 : -1;
        if (search) {
            query.$or = [
                {type: {$regex: search, $options: "i" } },
                {title: {$regex: search, $options: "i" } },
            ];
        }
        // Get total count
        const total = await CaseStudyTypes.countDocuments(query);

        // Fetch paginated & sorted users
        const data = await CaseStudyTypes.find(query)
        .sort({ [sortColumn]: sortOrderValue })
        .skip((page - 1) * limit)
        .limit(limit);

        res.json({ data, total });
    } catch (error) {
        next(error);
    }
}

exports.getAllCaseStudyTypeFrontend = async (req, res, next) => {
    try {
        let { sortColumn = "type", sortOrder = "asc" } = req.query;

        const sortOrderValue = sortOrder === "asc" ? 1 : -1;

        // Get total count
        const total = await CaseStudyTypes.countDocuments();

        // Fetch paginated & sorted users
        const data = await CaseStudyTypes.find()
        .sort({ [sortColumn]: sortOrderValue });

        res.json({ data, total });
    } catch (error) {
        next(error);
    }
}

exports.getCaseStudyTypeEntry = async (req, res, next) =>{
    try {
        const case_study_type = await CaseStudyTypes.findById(Object(req.params.id))

        if(!case_study_type) {
            return res.status(401).json({
                success: false,
                error: `case-study-type not found with id of ${req.params.id}`
            })
        }
        res.status(200).json({
            success: true,
            data: case_study_type
        })
    } catch (error) {
        next(error)
    }
}

exports.deleteCaseStudyType = async (req, res, next) => {
    try {
        const entry = await CaseStudyTypes.findById(req.params.id)

        if (!entry){
            return res.status(404).json({
                success: false,
                error: `case-study-type not found with id of ${req.params.id}`
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

exports.createCaseStudyType = async (req, res, next) => {
    try {
        const CaseStudyData = await CaseStudyTypes.create(req.body)

        res.status(201).json({
            success: true,
            message: "Form submitted successfully."
        })
    
    } catch (error) {
        next(error)
    }
}
exports.updateCaseStudyType = async (req, res, next) => {
    try {
        let CaseStudyType = await CaseStudyTypes.findById(req.params.id)

        if(!CaseStudyType){
            return res.status(401).json({
                success: false,
                error: `Case-Study not found with id ${req.params.id}`
            })
        }
        /*if (req.file != undefined && req.file.path) {
            const filePath = req.file.path; // Path to the uploaded CSV file
            
            
              if (filePath) {
                req.body.profile_picture = filePath
            }
        }*/
        CaseStudyType = await CaseStudyTypes.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            success: true,
            data: CaseStudyType
        })
    } catch (error) {
        next(error)
    }
}

// exports.getCaseStudyTypeFrontend = async (req, res, next) => {
//     try {
//         let { sortColumn = "name", sortOrder = "asc" } = req.query;

//         const sortOrderValue = sortOrder === "asc" ? 1 : -1;

//         // Get total count
//         const total = await CaseStudyTypes.countDocuments();

//         // Fetch paginated & sorted users
//         const data = await CaseStudyTypes.find()
//         .sort({ [sortColumn]: sortOrderValue })

//         res.json({ data, total });
//     } catch (error) {
//         next(error);
//     }
// }