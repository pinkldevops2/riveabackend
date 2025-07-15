const db = require("../models");
const ContactForm = db.contactform;

exports.getContactFormEntry = async (req, res, next) => {
    try {
        let { search = '', page = 1, limit = 10, sortColumn = "name", sortOrder = "asc" } = req.query;
        let query = {};
        page = parseInt(page);
        limit = parseInt(limit);
        const sortOrderValue = sortOrder === "asc" ? 1 : -1;
        if (search) {
            query.$or = [
                {name: {$regex: search, $options: "i"}},
                {email: {$regex: search, $options: "i"}},
                {phone: {$regex: search, $options: "i"}},
                {department: {$regex: search, $options: "i"}},
            ]
        }
        // Get total count
        const total = await ContactForm.countDocuments(query);

        // Fetch paginated & sorted users
        const data = await ContactForm.find(query)
        .sort({ [sortColumn]: sortOrderValue })
        .skip((page - 1) * limit)
        .limit(limit);

        res.json({ data, total });
    } catch (error) {
        next(error);
    }
}

exports.getContactEntry = async (req, res, next) =>{
    try {
        const menu = await ContactForm.findById(Object(req.params.id))

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

exports.deleteContactEntry = async (req, res, next) => {
    try {
        const entry = await ContactForm.findById(req.params.id)

        if (!entry){
            return res.status(404).json({
                success: false,
                error: `Menu not found with id of ${req.params.id}`
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

exports.submitContactForm = async (req, res, next) => {
    try {
        const contact = await ContactForm.create(req.body)

        res.status(201).json({
            success: true,
            message: "Form submitted successfully."
        })
    } catch (error) {
        next(error)
    }
}