const db = require("../models");
const Pages = db.pages;

exports.createPage = async (req, res, next) => {
    try {
        if (req.body.isHomePage) {
            const existingHomePage = await Pages.findOne({ isHomePage: true })

            if(existingHomePage){
                existingHomePage.isHomePage = false
                await existingHomePage.save()
            }
        }
        const page = await Pages.create(req.body)

        res.status(201).json({
            success: true,
            data: page
        })
    } catch (error) {
        next(error)
    }
}
exports.getPagesList = async (req, res, next) => {
    try {
        let {search = '', page = 1, limit = 10, sortColumn = "name", sortOrder = "asc" } = req.query;
        let query = {};
        page = parseInt(page);
        limit = parseInt(limit);
        const sortOrderValue = sortOrder === "asc" ? 1 : -1;
        if (search) {
            query.$or = [
            { title: { $regex: search, $options: "i" } },
            { slug: { $regex: search, $options: "i" } },
            ];
        }
        // Get total count
        const total = await Pages.countDocuments(query);
        
        // Fetch paginated & sorted users
        const data = await Pages.find(query, { title: 1, slug: 1, _id: 1, isActive: 1, isHomePage: 1, createdAt: 1, updatedAt: 1 })
        .sort({ [sortColumn]: sortOrderValue })
        .skip((page - 1) * limit)
        .limit(limit);

        res.json({ data, total });
    } catch (error) {
        next(error);
    }
}


exports.getPage = async (req, res, next) =>{
    try {
        const page = await Pages.findById(Object(req.params.id))

        if(!page) {
            return res.status(401).json({
                success: false,
                error: `Page not found with id of ${req.params.id}`
            })
        }
        res.status(200).json({
            success: true,
            data: page
        })
    } catch (error) {
        next(error)
    }
}


exports.getPageBySlug = async (req, res, next) =>{
    try {
        const page = await Pages.findOne({ slug: req.params.slug, isActive: true }, {_id: 0, title: 1, slug: 1, content: 1, page_template: 1,template_data: 1, isFooterAnimationTemplate: 1, metaTitle: 1, metaDescription: 1 })

        if (!page) {
            return res.status(404).json({
                success: false,
                message: `Page not found with slug ${req.params.slug}`
            })
        }
        res.status(200).json({
            success: true,
            data: page
        })
    } catch (error) {
        next(error)
    }
}

exports.getPageMetaBySlug = async (req, res, next) =>{
    try {
        const page = await Pages.findOne({ slug: req.params.slug, isActive: true }, { title: 1, _id: 1, metaTitle: 1, metaDescription: 1 })

        if (!page) {
            return res.status(404).json({
                success: false,
                message: `Page not found with slug ${req.params.slug}`
            })
        }
        res.status(200).json({
            success: true,
            data: page
        })
    } catch (error) {
        next(error)
    }
}

exports.getHomePageMeta = async (req, res, next) =>{
    try {
        const page = await Pages.findOne({ isHomePage: true, isActive: true }, { title: 1, _id: 1, metaTitle: 1, metaDescription: 1 })

        if (!page) {
            return res.status(404).json({
                success: false,
                message: `Page not found with slug ${req.params.slug}`
            })
        }
        res.status(200).json({
            success: true,
            data: page
        })
    } catch (error) {
        next(error)
    }
}

exports.getHomePage = async (req, res, next) => {
    try {
        const page = await Pages.findOne({ isHomePage: true, isActive: true}, { _id: 0,title: 1, slug: 1, content: 1, page_template: 1, template_data: 1,isFooterAnimationTemplate: 1,metaTitle: 1, metaDescription: 1 })
        if (!page) {
            return res.status(401).json({
                success: false,
                error: `There is no home page`
            })
        }
        res.status(200).json({
            success: true,
            data: page
        })
    } catch (error) {
        next(error)
    }
}

exports.updatePage = async (req, res, next) => {
    try {
        let page = await Pages.findById(req.params.id)

        if(!page){
            return res.status(401).json({
                success: false,
                error: `Page not found with id ${req.params.id}`
            })
        }

        if (req.body.isHomePage && req.body.isHomePage !== page.isHomePage) {
            const existingHomePage = await Pages.findOne({ isHomePage: true })

            if (existingHomePage && existingHomePage._id.toString() !== req.params.id){
                existingHomePage.isHomePage = false
                await existingHomePage.save()
            }
        }
        page = await Pages.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            success: true,
            data: page
        })
    } catch (error) {
        next(error)
    }
}

exports.deletePage = async (req, res, next) => {
    try {
        const page = await Pages.findById(req.params.id)

        if (!page){
            return res.status(404).json({
                success: false,
                error: `Page not found with id of ${req.params.id}`
            })
        }
        if (page.isHomePage) {
            return res.status(400).json({
                success: false,
                error: 'Cannot delete home page. Fist assign another page as Home page.'
            })
        }
        await page.deleteOne()
        res.status(200).json({
            success: true,
            data: {}
        })
    } catch (error) {
        next(error)
    }
}