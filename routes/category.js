const express = require('express');
const router = express.Router();

// Controllers
const { requireSignin, adminMiddleware } = require('../controllers/auth');
const {
    create,
    categoryById,
    read,
    update,
    remove,
    list, 
    photo,
    createEs,
    categoryByIdEs,
    readEs,
    updateEs,
    removeEs,
    listEs,
    photoEs
} = require('../controllers/category');

router.get('/category/:categoryId', read);
router.post('/category/create', requireSignin, adminMiddleware, create);
router.put('/category/:categoryId', requireSignin, adminMiddleware, update);
router.delete('/category/:categoryId', requireSignin, adminMiddleware, remove);
router.get("/category/photo/:categoryId", photo);
router.get('/categories', list);

router.get('/es/category/:categoryIdEs', readEs);
router.post('/es/category/create', requireSignin, adminMiddleware, createEs);
router.put('/es/category/:categoryIdEs', requireSignin, adminMiddleware, updateEs);
router.delete('/es/category/:categoryIdEs', requireSignin, adminMiddleware, removeEs);
router.get("/es/category/photo/:categoryIdEs", photoEs);
router.get('/es/categories', listEs);

router.param('categoryId', categoryById);
router.param('categoryIdEs', categoryByIdEs);

module.exports = router;
