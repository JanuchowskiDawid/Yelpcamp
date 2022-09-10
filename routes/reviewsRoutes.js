const express = require('express');
const router = express.Router({ mergeParams: true });
const reviews = require('../controllers/reviews')
const { isLoggedIn, validateReview, checkReviewOwner } = require('../utils/middleware');

router.post('/', isLoggedIn, validateReview,reviews.createComment);

router.delete('/:reviewId', isLoggedIn, checkReviewOwner, reviews.deleteComment);

module.exports = router;