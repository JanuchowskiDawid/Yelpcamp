const cities = require('./cities');
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const { places, descriptors } = require('./nameHelpers');

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

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const newCampground = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await newCampground.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});