const express = require('express');
const router = express.Router();

// Controllers
const { requireSignin, adminMiddleware } = require('../controllers/auth');
const { create, courseById, read, remove, update, list, listCategories, listBySearch, photo } = require('../controllers/course');

router.get('/course/:courseId', read);
router.post('/course/create', requireSignin, adminMiddleware, create);
router.delete(
    "/course/:courseId/",
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

router.param('courseId', courseById);

module.exports = router;
