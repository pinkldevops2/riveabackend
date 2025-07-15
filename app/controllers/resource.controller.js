const db = require("../models");
const Resource = db.resource;

exports.getResources = async (req, res, next) => {
    try {
        let { search = '', page = 1, limit = 10, sortColumn = "name", sortOrder = "asc" } = req.query;
        let query = {};
        page = parseInt(page);
        limit = parseInt(limit);
        const sortOrderValue = sortOrder === "asc" ? 1 : -1;
        if (search) {
            query.$or = [
                {name :{ $regex: search, $options: "i" } },
                {title :{ $regex: search, $options: "i" } },
                {slug :{ $regex: search, $options: "i" } },
            ];
        }
        // Get total count
        const total = await Resource.countDocuments(query);

        // Fetch paginated & sorted users
        const data = await Resource.find(query)
        .sort({ [sortColumn]: sortOrderValue })
        .skip((page - 1) * limit)
        .limit(limit);

        res.json({ data, total });
    } catch (error) {
        next(error);
    }
}

exports.getResourcesFrontend = async (req, res, next) => {
    try {
        let { search, character = '', page = 1, limit = 5, sortColumn = "name", sortOrder = "asc" } = req.query;

        let query = {};
        page = parseInt(page);
        limit = parseInt(limit);
        const sortOrderValue = sortOrder === "asc" ? 1 : -1;
        // Search by name or title
        if (search) {
            let escapeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            query.$or = [
            { name: { $regex: escapeSearch, $options: "i" } },
            { title: { $regex: escapeSearch, $options: "i" } },
            ];
        }
        if (character != '' && character != 'All') {
            let searchChar = character.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp('^' + searchChar, 'i');
            query.title= { $regex: regex };
        }
        // Pagination
        const resource = await Resource.find(query)
            .sort({ [sortColumn]: sortOrderValue })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));

        const total = await Resource.countDocuments(query);

        res.status(200).json({ resource, total });
    } catch (error) {
        next(error);
    }
}
exports.getResourceEntryBySlug = async (req, res, next) =>{
    try {
        let query = {}
        query.slug = req.params.slug;
        const resource = await Resource.findOne(query);
        let previous = null;
        let next = null;
        if(resource){
            // Get previous blog (newer post)
            previous = await Resource.findOne({
            createdAt: { $gt: resource.createdAt }
            })
            .sort({ createdAt: 1 })
            .select('slug');

            // Get next blog (older post)
            next = await Resource.findOne({
            createdAt: { $lt: resource.createdAt }
            })
        .sort({ createdAt: -1 })
        .select('slug');
        }
        if(!resource) {
            return res.status(401).json({
                success: false,
                error: `resource not found with id of ${req.params.id}`
            })
        }
        res.status(200).json({
            success: true,
            data: resource,
            next: next ? next.slug : null,
            previous: previous ? previous.slug : null
        })
    } catch (error) {
        next(error)
    }
}

exports.getResourceMetaBySlug = async (req, res, next) =>{
    try {
        let query = {}
        query.slug = req.params.slug;
        const resource = await Resource.findOne(query,{metaTitle: 1, metaDescription: 1});
        if(!resource) {
            return res.status(401).json({
                success: false,
                error: `resource not found with id of ${req.params.id}`
            })
        }
        res.status(200).json({
            success: true,
            data: resource
        })
    } catch (error) {
        next(error)
    }
}

exports.getResourcesByCharacter = async (req, res, next) => {
    try {
        const { character, page = 1, limit = 5 } = req.query;

        let query = {};
        // Search by name or title
        if (character) {
            let searchChar = character.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp('^' + searchChar, 'i');
            query = { name: { $regex: regex } };
        }

        // Pagination
        const resource = await Resource.find(query)
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));

        const total = await Resource.countDocuments(query);

        res.status(200).json({ resource, total });
    } catch (error) {
        next(error);
    }
}

exports.getResourceEntry = async (req, res, next) =>{
    try {
        const resource = await Resource.findById(Object(req.params.id))

        if(!resource) {
            return res.status(401).json({
                success: false,
                error: `resource not found with id of ${req.params.id}`
            })
        }
        res.status(200).json({
            success: true,
            data: resource
        })
    } catch (error) {
        next(error)
    }
}

exports.deleteResourceEntry = async (req, res, next) => {
    try {
        const entry = await Resource.findById(req.params.id)

        if (!entry){
            return res.status(404).json({
                success: false,
                error: `resource not found with id of ${req.params.id}`
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

exports.createResource = async (req, res, next) => {
    try {
        if (req.file != undefined && req.file.path) {
            const filePath = req.file.path; // Path to the uploaded CSV file
            
            
              if (filePath) {
                req.body.image = filePath
            }
        }
        const resourceData = await Resource.create(req.body)

        res.status(201).json({
            success: true,
            message: "Form submitted successfully."
        })
    
    } catch (error) {
        next(error)
    }
}
exports.updateResource = async (req, res, next) => {
    try {
        let resourceData = await Resource.findById(req.params.id)

        if(!resourceData){
            return res.status(401).json({
                success: false,
                error: `Doctor not found with id ${req.params.id}`
            })
        }
        if (req.file != undefined && req.file.path) {
            const filePath = req.file.path; // Path to the uploaded CSV file
            
            
              if (filePath) {
                req.body.image = filePath
            }
        }
        resourceData = await Resource.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            success: true,
            data: resourceData
        })
    } catch (error) {
        next(error)
    }
}