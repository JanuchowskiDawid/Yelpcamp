const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const { isLoggedIn, validateCampground, checkOwner } = require('../utils/middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(campgrounds.showAll)
    .post(isLoggedIn, upload.array('image'), campgrounds.createNewCampground);

router.get('/new', isLoggedIn, campgrounds.renderNewPage);

router.route('/:id')
    .get(campgrounds.renderShowPage)
    .put(isLoggedIn, checkOwner, upload.array('image'), campgrounds.updateCampground)
    .delete(isLoggedIn, checkOwner, campgrounds.deleteCampground);

router.get('/:id/edit', isLoggedIn, checkOwner, campgrounds.editCampground);

module.exports = router;