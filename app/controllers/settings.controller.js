const db = require("../models");
const Settings = db.settings;

exports.getAllSettings = async (req, res, next) => {
    try {
        let { page = 1, limit = 10, sortColumn = "name", sortOrder = "asc" } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);
        const sortOrderValue = sortOrder === "asc" ? 1 : -1;

        // Get total count
        const total = await Settings.countDocuments();

        // Fetch paginated & sorted users
        const data = await Settings.find()
        .sort({ [sortColumn]: sortOrderValue })
        .skip((page - 1) * limit)
        .limit(limit);

        res.json({ data, total });
    } catch (error) {
        next(error);
    }
}

exports.getSettingsByType = async (req, res, next) => {
    try {
        const { type, page = 1, limit = 5 } = req.query;

        let query = {};

        if (type) query.type = type;

        const data = await Settings.find(query)
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));

        const total = await Settings.countDocuments(query);

        res.status(200).json({ data, total });
    } catch (error) {
        next(error);
    }
}

exports.getSettingsEntry = async (req, res, next) =>{
    try {
        const setting = await Settings.findById(Object(req.params.id))

        if(!setting) {
            return res.status(401).json({
                success: false,
                error: `Setting not found with id of ${req.params.id}`
            })
        }
        res.status(200).json({
            success: true,
            data: setting
        })
    } catch (error) {
        next(error)
    }
}

exports.getSettingsEntryByType = async (req, res, next) =>{
    try {
        let typeName = req.params.type;
        const setting = await Settings.find({ type: { $regex: new RegExp(`^${req.params.type}$`, 'i') } })
        if(!setting) {
            return res.status(401).json({
                success: false,
                error: `Setting not found with type of ${req.params.type}`
            })
        }
        res.status(200).json({
            success: true,
            data: setting
        })
    } catch (error) {
        next(error)
    }
}

exports.deleteSettingEntry = async (req, res, next) => {
    try {
        const entry = await Settings.findById(req.params.id)

        if (!entry){
            return res.status(404).json({
                success: false,
                error: `Setting not found with id of ${req.params.id}`
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

exports.createSetting = async (req, res, next) => {
    try {
        const setting = await Settings.create(req.body)

        res.status(201).json({
            success: true,
            message: "Setting submitted successfully."
        })
    
    } catch (error) {
        next(error)
    }
}

exports.updateSetting = async (req, res, next) => {
    try {
        let setting = await Settings.findById(req.params.id)

        if(!setting){
            return res.status(401).json({
                success: false,
                error: `Setting not found with id ${req.params.id}`
            })
        }

        setting = await Settings.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            success: true,
            data: setting
        })
    } catch (error) {
        next(error)
    }
}