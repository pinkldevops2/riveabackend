const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
const pagecontroller = require("../controllers/page.controller");
const menucontroller = require("../controllers/menus.controller");
const contactuscontroller = require("../controllers/contactUs.controller");
const doctorscontroller = require("../controllers/doctors.controller");
const newscategorycontroller = require("../controllers/newsCategory.controller");
const newscontroller = require("../controllers/news.controller");
const resourcecontroller = require("../controllers/resource.controller");
const testimonialcontroller = require("../controllers/testimonial.controller");
const testimonialcategorycontroller = require("../controllers/testimonialCategory.controller");
const casestudiescontroller = require("../controllers/caseStudies.controller");
const casestudytypescontroller = require("../controllers/caseStudyTypes.controller");
const casestudycategorycontroller = require("../controllers/caseStudyCategory.controller");
const settingscontroller = require("../controllers/settings.controller");
const gallerycontroller = require("../controllers/gallery.controller");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });


  app.get("/api/pages/home", [], pagecontroller.getHomePage);
  app.get("/api/pages/slug/:slug", [], pagecontroller.getPageBySlug);
  app.get("/api/pages/slug-meta/:slug", [], pagecontroller.getPageMetaBySlug);
  app.get("/api/pages/home-meta", [], pagecontroller.getHomePageMeta);
  
  app.get("/api/menus-list/:location", [], menucontroller.getMenuByLocation);

  app.post("/api/contact", [], contactuscontroller.submitContactForm);

  app.get("/api/doctors", [], doctorscontroller.getDoctorsFrontend);
  app.get("/api/doctors-speciality", [], doctorscontroller.getDoctorsSpeciality);

  app.get("/api/get-resources", [], resourcecontroller.getResourcesFrontend);
  app.get("/api/get-resources-by-slug/:slug", [], resourcecontroller.getResourceEntryBySlug);
  app.get("/api/get-resources-by-character", [], resourcecontroller.getResourcesByCharacter);
  app.get("/api/resources/slug-meta/:slug", [], resourcecontroller.getResourceMetaBySlug);
  app.get("/api/get-news-category", [], newscategorycontroller.getCategoryFronted);
  app.get("/api/get-news-categories", [], newscategorycontroller.getNewsCategories);
  app.get("/api/news/slug-meta/:slug", [], newscontroller.getNewsMetaBySlug);
  app.get("/api/get-news-by-slug/:slug", [], newscontroller.getNewsEntryBySlug);
  app.get("/api/get-news", [], newscontroller.getNewsFrontend);
  app.get("/api/get-testimonials", [], testimonialcontroller.getTestimonialsFrontend);

  app.get("/api/get-testimonial-categories", [], testimonialcategorycontroller.getTestimonialCategories);
  app.get("/api/get-testimonial-category", [], testimonialcategorycontroller.getCategoryFronted);

  app.get("/api/get-case-studies", [], casestudiescontroller.getCaseStudyFrontend);
  app.get("/api/case-study/slug/:slug", [], casestudiescontroller.getCaseStudyBySlug);
  app.get("/api/case-study/slug-meta/:slug", [], casestudiescontroller.getCaseStudyMetaBySlug);
  app.get("/api/get-case-study-types", [], casestudytypescontroller.getAllCaseStudyTypeFrontend);
  app.get("/api/case-study-categories-by-type/", [], casestudycategorycontroller.getCategoriesByType);
  app.get("/api/case-study-categories-by-type/:type", [], casestudycategorycontroller.getCategoriesByType);

  app.get("/api/get-settings", [], settingscontroller.getSettingsByType);

  app.get("/api/get-full-gallery", [], gallerycontroller.getGalleryFrontend);
};
