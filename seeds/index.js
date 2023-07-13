const mongoose = require('mongoose');
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers');
const Campground = require('../models/campground')

mongoose.connect('mongodb://localhost:27017/yelp-camp')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("database Connected")
})

const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)];
}

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++){
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '64a5fad2226f4c768b91ef1f',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo, porro repellendus praesentium voluptate architecto esse maiores a reprehenderit facere corrupti, obcaecati quis sequi tempore, eius aliquam culpa ad molestias mollitia.',
            price,
            geometry: {
                type: "Point",
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dmjmz4ipe/image/upload/v1689108106/cld-sample-2.jpg',
                    filename: 'YelpCamp/b7lu8gaxe2nn7yghfru5'
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then( () => {
    mongoose.connection.close();
});