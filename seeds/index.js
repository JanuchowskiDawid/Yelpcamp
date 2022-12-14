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
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const randomPrice = Math.floor(Math.random() * 50) + 10;
        const newCampground = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [{
                path: "https://res.cloudinary.com/dkz5owf75/image/upload/v1662743570/YelpCamp/au4w3c7w5uaftmafi6cs.jpg",
                filename: 'image1'
            }, {
                path: "https://res.cloudinary.com/dkz5owf75/image/upload/v1662743570/YelpCamp/nulq6mawv7ib4wbo333f.jpg",
                filename: 'image2'
            }],
            geometry: {
                type: 'Point',
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]
            },
            description: 'csawadasfaffsaafasfsaffas',
            price: randomPrice,
            author: "631a1abe4e002c069d4bef96"
        })
        await newCampground.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});