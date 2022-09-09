const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const { isLoggedIn, validateCampground, checkOwner } = require('../utils/middleware');

router.route('/')
    .get(campgrounds.showAll)
    .post(isLoggedIn, campgrounds.createNewPage);

router.get('/new', isLoggedIn, campgrounds.renderNewPage);

router.route('/:id')
    .get(campgrounds.renderShowPage)
    .put(isLoggedIn, checkOwner, campgrounds.updateCampground)
    .delete(isLoggedIn, checkOwner, campgrounds.deleteCampground);

router.get('/:id/edit', isLoggedIn, checkOwner, campgrounds.editCampground);

module.exports = router;