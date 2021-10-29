const express = require('express');
const router = express.Router();

// Controllers
const { requireSignin, adminMiddleware } = require('../controllers/auth');
const { create, categoryById, read, update, remove, list, photo } = require('../controllers/category');

router.get('/category/:categoryId', read);
router.post('/category/create', requireSignin, adminMiddleware, create);
router.put('/category/:categoryId', requireSignin, adminMiddleware, update);
router.delete('/category/:categoryId', requireSignin, adminMiddleware, remove);
router.get("/category/photo/:categoryId", photo);
router.get('/categories', list);

router.param('categoryId', categoryById);

module.exports = router;
