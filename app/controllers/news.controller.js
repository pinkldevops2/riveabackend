const db = require("../models");
const News = db.news;

exports.getNews = async (req, res, next) => {
    try {
        let { search = '', page = 1, limit = 10, sortColumn = "name", sortOrder = "asc" } = req.query;
        let query = {};
        page = parseInt(page);
        limit = parseInt(limit);
        const sortOrderValue = sortOrder === "asc" ? 1 : -1;
        if (search) {
            query.$or = [
                {name: {$regex: search, $options: "i" }},
                {title: {$regex: search, $options: "i" }},
                {slug: {$regex: search, $options: "i" }},
            ]
        }
        // Get total count
        const total = await News.countDocuments(query);

        // Fetch paginated & sorted users
        const data = await News.find(query)
        .sort({ [sortColumn]: sortOrderValue })
        .skip((page - 1) * limit)
        .limit(limit);

        res.json({ data, total });
    } catch (error) {
        next(error);
    }
}

exports.getNewsFrontend = async (req, res, next) => {
    try {
        let { search, category_id, page = 1, limit = 5, sortColumn = "name", sortOrder = "asc" } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);
        let query = {};
        const sortOrderValue = sortOrder === "asc" ? 1 : -1;
        // Search by name or email
        if (search) {
            let escapeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            query.$or = [
            { name: { $regex: escapeSearch, $options: "i" } },
            { title: { $regex: escapeSearch, $options: "i" } },
            ];
        }

        // Apply filters
        if (category_id) query.categories = category_id;

        // Pagination
        const news = await News.find(query)
            .sort({ [sortColumn]: sortOrderValue })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));

        const total = await News.countDocuments(query);

        res.status(200).json({ news, total });
    } catch (error) {
        next(error);
    }
}

exports.getNewsEntry = async (req, res, next) =>{
    try {
        const news = await News.findById(Object(req.params.id))

        if(!news) {
            return res.status(401).json({
                success: false,
                error: `News not found with id of ${req.params.id}`
            })
        }
        res.status(200).json({
            success: true,
            data: news
        })
    } catch (error) {
        next(error)
    }
}

exports.getNewsEntryBySlug = async (req, res, next) =>{
    try {
        let query = {}
        query.slug = req.params.slug;
        const news = await News.findOne(query);
        if(!news) {
            return res.status(401).json({
                success: false,
                error: `news not found with id of ${req.params.id}`
            })
        }
        let previous = null;
        let next = null;
        if(news){
            // Get previous blog (newer post)
            previous = await News.findOne({
            createdAt: { $gt: news.createdAt }
            })
            .sort({ createdAt: 1 })
            .select('slug');

            // Get next blog (older post)
            next = await News.findOne({
            createdAt: { $lt: news.createdAt }
            })
        .sort({ createdAt: -1 })
        .select('slug');
        }
        res.status(200).json({
            success: true,
            data: news,
            next: next ? next.slug : null,
            previous: previous ? previous.slug : null
        })
    } catch (error) {
        next(error)
    }
}

exports.getNewsMetaBySlug = async (req, res, next) =>{
    try {
        let query = {}
        query.slug = req.params.slug;
        const news = await News.findOne(query,{metaTitle: 1, metaDescription: 1});
        if(!news) {
            return res.status(401).json({
                success: false,
                error: `news not found with id of ${req.params.id}`
            })
        }
        res.status(200).json({
            success: true,
            data: news
        })
    } catch (error) {
        next(error)
    }
}

exports.deleteNewsEntry = async (req, res, next) => {
    try {
        const entry = await News.findById(req.params.id)

        if (!entry){
            return res.status(404).json({
                success: false,
                error: `News not found with id of ${req.params.id}`
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

exports.createNews = async (req, res, next) => {
    try {
        if (req.file != undefined && req.file.path) {
            const filePath = req.file.path; // Path to the uploaded CSV file
            
            
              if (filePath) {
                req.body.image = filePath
            }
        }
        const newsData = await News.create(req.body)

        res.status(201).json({
            success: true,
            message: "Form submitted successfully."
        })
    
    } catch (error) {
        next(error)
    }
}
exports.updateNews = async (req, res, next) => {
    try {
        let newsData = await News.findById(req.params.id)

        if(!newsData){
            return res.status(401).json({
                success: false,
                error: `News not found with id ${req.params.id}`
            })
        }
        if (req.file != undefined && req.file.path) {
            const filePath = req.file.path; // Path to the uploaded CSV file
            
            
              if (filePath) {
                req.body.image = filePath
            }
        }
        newsData = await News.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            success: true,
            data: newsData
        })
    } catch (error) {
        next(error)
    }
}