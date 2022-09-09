const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');

module.exports.showAll = catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
});

module.exports.renderNewPage = (req, res) => {
    res.render('campgrounds/new');
};

module.exports.renderShowPage = catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
});

module.exports.createNewCampground = catchAsync(async (req, res, next) => {
    const newCampground = new Campground(req.body.campground);
    newCampground.images = req.files.map(f => ({ path: f.path, filename: f.filename }));
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash('success', 'Congrats! New campground created')
    res.redirect(`/campgrounds/${newCampground._id}`);
});

module.exports.updateCampground = catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ path: f.path, filemane: f.filename }));
    campground.images.push(...imgs);
    campground.save();
    console.log(req.body.deleteImages);
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    };
    req.flash('success', 'Campground updated!');
    res.redirect(`/campgrounds/${campground._id}`);
});

module.exports.editCampground = catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
});

module.exports.deleteCampground = catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground deleted!');
    res.redirect(`/campgrounds`);
});