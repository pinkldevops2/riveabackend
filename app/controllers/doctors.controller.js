const db = require("../models");
const DoctorsList = db.doctors;

exports.getDoctorsList = async (req, res, next) => {
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
                {degree: {$regex: search, $options: "i"}},
                {mobile: {$regex: search, $options: "i"}},
                {speciality: {$regex: search, $options: "i"}},
            ]
        }
        // Get total count
        const total = await DoctorsList.countDocuments(query);

        // Fetch paginated & sorted users
        const data = await DoctorsList.find(query)
        .sort({ [sortColumn]: sortOrderValue })
        .skip((page - 1) * limit)
        .limit(limit);

        res.json({ data, total });
    } catch (error) {
        next(error);
    }
}

exports.getDoctorsFrontend = async (req, res, next) => {
    try {
        const { search, speciality, language, gender, page = 1, limit = 5 } = req.query;

        let query = {};

        // Search by name or email
        if (search) {
            query.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            ];
        }
        query.isActive = true;

        // Apply filters
        if (speciality) query.speciality = { $regex: speciality, $options: "i" };
        if (language) query.languages = { $regex: language, $options: "i" };
        if (gender) query.gender = gender;

        // Pagination
        const doctors = await DoctorsList.find(query)
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));

        const total = await DoctorsList.countDocuments(query);

        res.status(200).json({ doctors, total });
    } catch (error) {
        next(error);
    }
}

exports.getDoctorsSpeciality = async (req, res, next) => {
    try {
        const doctors = await DoctorsList.find({}, "speciality languages"); // Fetch only the 'speciality' field

        // Extract and split comma-separated specialities
        let specialitiesSet = new Set();
        let languageSet = new Set();

        doctors.forEach((doctor) => {
        if (doctor.speciality) {
            doctor.speciality.split(",").forEach((s) => specialitiesSet.add(s.trim()));
        }
        if (doctor.languages) {
            doctor.languages.split(",").forEach((s) => languageSet.add(s.trim()));
        }
        });

        // Convert Set to Array and sort alphabetically
        const uniqueSpecialities = Array.from(specialitiesSet).sort();
        const uniqueLanguages = Array.from(languageSet).sort();

        res.status(200).json({ specialities: uniqueSpecialities, languages: uniqueLanguages });
    } catch (error) {
        next(error);
    }
}

exports.getDoctorEntry = async (req, res, next) =>{
    try {
        const menu = await DoctorsList.findById(Object(req.params.id))

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

exports.deleteDoctorEntry = async (req, res, next) => {
    try {
        const entry = await DoctorsList.findById(req.params.id)

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

exports.createDoctor = async (req, res, next) => {
    try {
        if (req.file != undefined && req.file.path) {
            const filePath = req.file.path; // Path to the uploaded CSV file
            
            
              if (filePath) {
                req.body.profile_picture = filePath
            }
        }
        const contact = await DoctorsList.create(req.body)

        res.status(201).json({
            success: true,
            message: "Form submitted successfully."
        })
    
    } catch (error) {
        next(error)
    }
}
exports.updateDoctor = async (req, res, next) => {
    try {
        let doctor = await DoctorsList.findById(req.params.id)

        if(!doctor){
            return res.status(401).json({
                success: false,
                error: `Doctor not found with id ${req.params.id}`
            })
        }
        if (req.file != undefined && req.file.path) {
            const filePath = req.file.path; // Path to the uploaded CSV file
            
            
              if (filePath) {
                req.body.profile_picture = filePath
            }
        }
        doctor = await DoctorsList.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            success: true,
            data: doctor
        })
    } catch (error) {
        next(error)
    }
}