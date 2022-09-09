const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const { isLoggedIn, validateCampground, checkOwner } = require('../utils/middleware');


router.get('/', campgrounds.showAll);

router.get('/new', isLoggedIn, campgrounds.renderNewPage);

router.get('/:id', campgrounds.renderShowPage);

router.post('/', isLoggedIn, campgrounds.createNewPage);

router.put('/:id', isLoggedIn, checkOwner, campgrounds.updateCampground);

router.get('/:id/edit', isLoggedIn, checkOwner, campgrounds.editCampground);

router.delete('/:id', isLoggedIn, checkOwner, campgrounds.deleteCampground);

module.exports = router;