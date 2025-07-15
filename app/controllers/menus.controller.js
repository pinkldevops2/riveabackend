const db = require("../models");
const Menus = db.menus;
const ContactForm = db.contactform;

exports.createMenu = async (req, res, next) => {
    try {
        const menu = await Menus.create(req.body)

        res.status(201).json({
            success: true,
            data: menu
        })
    } catch (error) {
        next(error)
    }
}

exports.getMenus = async (req, res, next) => {
    try {
        let {location = "top", page = 1, limit = 10, sortColumn = "name", sortOrder = "asc" } = req.query;

        let query = {};
        // if (search) {
        //     query.$or = [
        //     { name: { $regex: search, $options: "i" } },
        //     { email: { $regex: search, $options: "i" } },
        //     ];
        // }

        // Apply filters
        if (location) query.location = location;
        
        page = parseInt(page);
        limit = parseInt(limit);
        const sortOrderValue = sortOrder === "asc" ? 1 : -1;

        // Get total count
        const total = await Menus.countDocuments(query);

        // Fetch paginated & sorted users
        const data = await Menus.find(query)
        .sort({ [sortColumn]: sortOrderValue })
        .skip((page - 1) * limit)
        .limit(limit);

        res.json({ data, total });
    } catch (error) {
        next(error);
    }
}

exports.getMenu = async (req, res, next) =>{
    try {
        const menu = await Menus.findById(Object(req.params.id))

        if(!menu) {
            return res.status(401).json({
                success: false,
                error: `Menu not found with id of ${req.params.id}`
            })
        }
        res.status(200).json({
            success: true,
            data: menu
        })
    } catch (error) {
        next(error)
    }
}


exports.getMenuBySlug = async (req, res, next) =>{
    try {
        const menu = await Menus.findOne({ slug: req.params.slug })

        if (!menu) {
            return res.status(404).json({
                success: false,
                message: `Menu not found with slug ${req.params.slug}`
            })
        }
        res.status(200).json({
            success: true,
            data: menu
        })
    } catch (error) {
        next(error)
    }
}

exports.updateMenu = async (req, res, next) => {
    try {
        let menu = await Menus.findById(req.params.id)

        if(!menu){
            return res.status(401).json({
                success: false,
                error: `Menu not found with id ${req.params.id}`
            })
        }

        menu = await Menus.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            success: true,
            data: menu
        })
    } catch (error) {
        next(error)
    }
}

exports.deleteMenu = async (req, res, next) => {
    try {
        const menu = await Menus.findById(req.params.id)

        if (!menu){
            return res.status(404).json({
                success: false,
                error: `Menu not found with id of ${req.params.id}`
            })
        }
        if (menu.isHomeMenu) {
            return res.status(400).json({
                success: false,
                error: 'Cannot delete home menu. Fist assign another menu as Home menu.'
            })
        }
        await menu.deleteOne()
        res.status(200).json({
            success: true,
            data: {}
        })
    } catch (error) {
        next(error)
    }
}

exports.getMenuByLocation = async (req, res, next) =>{
    try {
        const menu = await Menus.find({ location: req.params.location }, { title: 1, url: 1, location: 1, targetWindow: 1, targetColumn: 1, order: 1 })
        .sort({ order: 1 });
        
        if (!menu) {
            return res.status(404).json({
                success: false,
                message: `Menu not found with slug ${req.params.slug}`
            })
        }
        res.status(200).json({
            success: true,
            data: menu
        })
    } catch (error) {
        next(error)
    }
}

exports.submitContactForm = async (req, res, next) => {
    try {
        const contact = await ContactForm.create(req.body)

        res.status(201).json({
            success: true,
            data: contact
        })
    } catch (error) {
        next(error)
    }
}