const express = require('express');
const router = express.Router({ mergeParams: true });
const reviews = require('../controllers/reviews')
const { isLoggedIn, checkReviewOwner } = require('../utils/middleware');


router.post('/', isLoggedIn, reviews.createComment);

router.delete('/:reviewId', isLoggedIn, checkReviewOwner, reviews.deleteComment);

module.exports = router;