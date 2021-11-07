const express = require('express');
const router = express.Router();

// Controllers
const { requireSignin, adminMiddleware } = require('../controllers/auth');
const {
    create,
    courseById,
    read,
    remove,
    update,
    list,
    listCategories,
    listBySearch,
    photo,
    createEs,
    courseByIdEs,
    readEs,
    removeEs,
    updateEs,
    listEs,
    listCategoriesEs,
    listBySearchEs,
    photoEs
} = require('../controllers/course');

router.get('/course/:courseId', read);
router.post('/course/create', requireSignin, adminMiddleware, create);
router.delete(
    "/course/:courseId",
    requireSignin,
    adminMiddleware,
    remove
);
router.put(
    "/course/:courseId",
    requireSignin,
    adminMiddleware,
    update
);
router.get("/courses", list);
router.get("/courses/categories", listCategories);
router.post("/courses/by/search", listBySearch);
router.get("/course/photo/:courseId", photo);

router.get('/es/course/:courseIdEs', readEs);
router.post('/es/course/create', requireSignin, adminMiddleware, createEs);
router.delete(
    "/es/course/:courseIdEs",
    requireSignin,
    adminMiddleware,
    removeEs
);
router.put(
    "/es/course/:courseIdEs",
    requireSignin,
    adminMiddleware,
    updateEs
);
router.get("/es/courses", listEs);
router.get("/es/courses/categories", listCategoriesEs);
router.post("/es/courses/by/search", listBySearchEs);
router.get("/es/course/photo/:courseIdEs", photoEs);

router.param('courseId', courseById);
router.param('courseIdEs', courseByIdEs);

module.exports = router;
