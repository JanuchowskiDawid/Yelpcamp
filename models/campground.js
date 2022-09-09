const mongoose = require('mongoose');
const { campgroundSchema } = require('../schemas/campgroundSchema');
const review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    path: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.path.replace('/upload', '/upload/w_200');
})

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
})

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await review.remove({
            _id: { $in: doc.reviews }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);