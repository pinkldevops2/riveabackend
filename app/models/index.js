const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};
mongoose.set('strictQuery', false);
db.mongoose = mongoose;

db.user = require("./user.model");
db.pages = require("./pages.model");
db.menus = require("./menus.model");
db.contactform = require("./contactForm.model");
db.doctors = require("./doctors.model");
db.resource = require("./resource.model");
db.news = require("./news.model");
db.newscategories = require("./newsCategory.model");
db.testimonialcategories = require("./testimonialCategory.model");
db.casestudycategories = require("./caseStudyCategory.model");
db.testimonials = require("./testimonials.model");
db.casestudies = require("./caseStudies.model");
db.casestudytypes = require("./caseStudyTypes.model");
db.settings = require("./settings.model");
db.gallery = require("./gallery.model");
module.exports = db;