const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Review = require('./models/review');
const campgroundSchema = require('./schemas/campgroundSchema');
const reviewSchema = require('./schemas/reviewSchema');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');
const { stat } = require('fs');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("mongo connected");
    })
    .catch((err) => {
        console.log("ERROR! Mongo error :c");
        console.log(err);
    })

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const validateCampground = ((req, res, next) => {

    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
})

const validateReview = ((req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
})

app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show', { campground });
}))

app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`);
}))

app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`);
}))

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
}))

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect(`/campgrounds`);
}))

app.post('/campgrounds/:id/reviews', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))


app.all('*', (req, res, next) => {
    next(new ExpressError('404! Page not found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
    console.log('Serving on port 3000');
})