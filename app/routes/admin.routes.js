const { authJwt } = require("../middlewares");
const { upload } = require("../middlewares/multer")
//const uploadMultiple = upload.fields([{ name: 'image', maxCount: 1 }, { name: 'gallery', maxCount: 3 }])

const usercontroller = require("../controllers/user.controller");
const pagecontroller = require("../controllers/page.controller");
const menucontroller = require("../controllers/menus.controller");
const uploadcontroller = require("../controllers/upload.controller");
const contactuscontroller = require("../controllers/contactUs.controller");
const doctorscontroller = require("../controllers/doctors.controller");
const resourcecontroller = require("../controllers/resource.controller");
const newscontroller = require("../controllers/news.controller");
const newscategorycontroller = require("../controllers/newsCategory.controller");
const testimonialcategorycontroller = require("../controllers/testimonialCategory.controller");
const testimonialcontroller = require("../controllers/testimonial.controller");
const casestudycategorycontroller = require("../controllers/caseStudyCategory.controller");
const casestudiescontroller = require("../controllers/caseStudies.controller");
const casestudytypescontroller = require("../controllers/caseStudyTypes.controller");
const settingscontroller = require("../controllers/settings.controller");
const gallerycontroller = require("../controllers/gallery.controller");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept",
    );
    next();
  });
  app.get("/api/pages", [authJwt.verifyToken], pagecontroller.getPagesList);
  app.get("/api/pages/:id", [authJwt.verifyToken], pagecontroller.getPage);
  app.post("/api/pages/create", [authJwt.verifyToken], pagecontroller.createPage);
  app.put("/api/pages/update/:id", [authJwt.verifyToken], pagecontroller.updatePage);
  app.delete("/api/pages/delete/:id", [authJwt.verifyToken], pagecontroller.deletePage);

  app.post("/api/upload_image", [authJwt.verifyToken, upload.single("file")], uploadcontroller.uploadImage);

  app.get("/api/menus", [authJwt.verifyToken], menucontroller.getMenus);
  app.get("/api/menus/:id", [authJwt.verifyToken], menucontroller.getMenu);
  app.post("/api/menus/create", [authJwt.verifyToken], menucontroller.createMenu);
  app.put("/api/menus/update/:id", [authJwt.verifyToken], menucontroller.updateMenu);
  app.delete("/api/menus/delete/:id", [authJwt.verifyToken], menucontroller.deleteMenu);

  app.get("/api/doctors-list", [authJwt.verifyToken], doctorscontroller.getDoctorsList);
  app.get("/api/doctors-list/:id", [authJwt.verifyToken], doctorscontroller.getDoctorEntry);
  app.post("/api/doctors-list/create", [authJwt.verifyToken, upload.single("file")], doctorscontroller.createDoctor);
  app.put("/api/doctors-list/update/:id", [authJwt.verifyToken, upload.single("file")], doctorscontroller.updateDoctor);
  app.delete("/api/doctors-list/delete/:id", [authJwt.verifyToken], doctorscontroller.deleteDoctorEntry);

  app.get("/api/users", [authJwt.verifyToken], usercontroller.getUsersList);
  app.get("/api/users/:id", [authJwt.verifyToken], usercontroller.getUserById);
  app.post("/api/users/create", [authJwt.verifyToken, upload.single("file")], usercontroller.createUser);
  app.put("/api/users/update/:id", [authJwt.verifyToken, upload.single("file")], usercontroller.updateUser);
  app.delete("/api/users/delete/:id", [authJwt.verifyToken], usercontroller.deleteUser);


  app.get("/api/contact-form", [authJwt.verifyToken], contactuscontroller.getContactFormEntry);
  app.get("/api/contact-form/:id", [authJwt.verifyToken], contactuscontroller.getContactEntry);
  app.delete("/api/contact-form/delete/:id", [authJwt.verifyToken], contactuscontroller.deleteContactEntry);


  app.get("/api/resources", [authJwt.verifyToken], resourcecontroller.getResources);
  app.get("/api/resources/:id", [authJwt.verifyToken], resourcecontroller.getResourceEntry);
  app.post("/api/resources/create", [authJwt.verifyToken,upload.single("file")], resourcecontroller.createResource);
  app.put("/api/resources/update/:id", [authJwt.verifyToken, upload.single("file")], resourcecontroller.updateResource);
  app.delete("/api/resources/delete/:id", [authJwt.verifyToken], resourcecontroller.deleteResourceEntry);


  app.get("/api/news", [authJwt.verifyToken], newscontroller.getNews);
  app.get("/api/news/:id", [authJwt.verifyToken], newscontroller.getNewsEntry);
  app.post("/api/news/create", [authJwt.verifyToken,upload.single("file")], newscontroller.createNews);
  app.put("/api/news/update/:id", [authJwt.verifyToken,upload.single("file")], newscontroller.updateNews);
  app.delete("/api/news/delete/:id", [authJwt.verifyToken], newscontroller.deleteNewsEntry);

  app.get("/api/news-category", [authJwt.verifyToken], newscategorycontroller.getCategories);
  app.get("/api/news-category/:id", [authJwt.verifyToken], newscategorycontroller.getCategoriesEntry);
  app.post("/api/news-category/create", [authJwt.verifyToken,upload.single("file")], newscategorycontroller.createCategory);
  app.put("/api/news-category/update/:id", [authJwt.verifyToken,upload.single("file")], newscategorycontroller.updateCategory);
  app.delete("/api/news-category/delete/:id", [authJwt.verifyToken], newscategorycontroller.deleteCategoryEntry);

  app.get("/api/testimonial-category", [authJwt.verifyToken], testimonialcategorycontroller.getCategories);
  app.get("/api/testimonial-category/:id", [authJwt.verifyToken], testimonialcategorycontroller.getCategoriesEntry);
  app.post("/api/testimonial-category/create", [authJwt.verifyToken,upload.single("file")], testimonialcategorycontroller.createCategory);
  app.put("/api/testimonial-category/update/:id", [authJwt.verifyToken,upload.single("file")], testimonialcategorycontroller.updateCategory);
  app.delete("/api/testimonial-category/delete/:id", [authJwt.verifyToken], testimonialcategorycontroller.deleteCategoryEntry);

  app.get("/api/case-study-category", [authJwt.verifyToken], casestudycategorycontroller.getCategories);
  app.get("/api/case-study-category/:id", [authJwt.verifyToken], casestudycategorycontroller.getCategoriesEntry);
  app.get("/api/case-study-category-by-type/:type", [authJwt.verifyToken], casestudycategorycontroller.getCategoriesByType);
  app.post("/api/case-study-category/create", [authJwt.verifyToken,upload.single("file")], casestudycategorycontroller.createCategory);
  app.put("/api/case-study-category/update/:id", [authJwt.verifyToken,upload.single("file")], casestudycategorycontroller.updateCategory);
  app.delete("/api/case-study-category/delete/:id", [authJwt.verifyToken], casestudycategorycontroller.deleteCategoryEntry);
  app.get("/api/all-case-study-category", [], casestudycategorycontroller.getAllCaseStudyCategoryFrontend);



  app.get("/api/testimonials", [authJwt.verifyToken], testimonialcontroller.getTestimonials);
  app.get("/api/testimonials/:id", [authJwt.verifyToken], testimonialcontroller.getTestimonialEntry);
  app.post("/api/testimonials/create", [authJwt.verifyToken,upload.fields([{ name: 'file', maxCount: 1 },{ name: 'videoPoster', maxCount: 1 },{ name: 'video', maxCount: 1 }])], testimonialcontroller.createTestimonial);
  app.put("/api/testimonials/update/:id", [authJwt.verifyToken,upload.fields([{ name: 'file', maxCount: 1 },{ name: 'videoPoster', maxCount: 1 },{ name: 'video', maxCount: 1 }])], testimonialcontroller.updateTestimonial);
  app.delete("/api/testimonials/delete/:id", [authJwt.verifyToken], testimonialcontroller.deleteTestimonialEntry);

  app.get("/api/case-study-type", [authJwt.verifyToken], casestudytypescontroller.getAllCaseStudyType);
  app.get("/api/all-case-study-type", [], casestudytypescontroller.getAllCaseStudyTypeFrontend);
  app.get("/api/case-study-type/:id", [authJwt.verifyToken], casestudytypescontroller.getCaseStudyTypeEntry);
  app.post("/api/case-study-type/create", [authJwt.verifyToken,upload.single("file")], casestudytypescontroller.createCaseStudyType);
  app.put("/api/case-study-type/update/:id", [authJwt.verifyToken,upload.single("file")], casestudytypescontroller.updateCaseStudyType);
  app.delete("/api/case-study-type/delete/:id", [authJwt.verifyToken], casestudytypescontroller.deleteCaseStudyType);

  app.get("/api/case-studies", [authJwt.verifyToken], casestudiescontroller.getCaseStudies);
  app.get("/api/case-studies/:id", [authJwt.verifyToken], casestudiescontroller.getCaseStudyEntry);
  app.post("/api/case-studies/create", [authJwt.verifyToken,upload.single("file")], casestudiescontroller.createCaseStudy);
  app.put("/api/case-studies/update/:id", [authJwt.verifyToken,upload.single("file")], casestudiescontroller.updateCaseStudy);
  app.delete("/api/case-studies/delete/:id", [authJwt.verifyToken], casestudiescontroller.deleteCaseStudyEntry);

  app.get("/api/settings", [authJwt.verifyToken], settingscontroller.getAllSettings);
  app.get("/api/settings/:id", [authJwt.verifyToken], settingscontroller.getSettingsEntry);
  app.get("/api/settings/type/:type", [authJwt.verifyToken], settingscontroller.getSettingsEntryByType);
  app.post("/api/settings/create", [authJwt.verifyToken], settingscontroller.createSetting);
  app.put("/api/settings/update/:id", [authJwt.verifyToken], settingscontroller.updateSetting);
  app.delete("/api/settings/delete/:id", [authJwt.verifyToken], settingscontroller.deleteSettingEntry);

  app.get("/api/gallery", [authJwt.verifyToken], gallerycontroller.getGallery);
  app.get("/api/gallery/:id", [authJwt.verifyToken], gallerycontroller.getGalleryEntry);
  app.post("/api/gallery/create", [authJwt.verifyToken,upload.fields([{ name: 'file', maxCount: 1 },{ name: 'videoPoster', maxCount: 1 },{ name: 'video', maxCount: 1 }])], gallerycontroller.createGallery);
  app.put("/api/gallery/update/:id", [authJwt.verifyToken,upload.fields([{ name: 'file', maxCount: 1 },{ name: 'videoPoster', maxCount: 1 },{ name: 'video', maxCount: 1 }])], gallerycontroller.updateGallery);
  app.delete("/api/gallery/delete/:id", [authJwt.verifyToken], gallerycontroller.deleteGalleryEntry);
};
