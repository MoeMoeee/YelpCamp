const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

const campgroundSchema = new Schema({
    title: String,
    images: [
        {
            url: String,
            filename: String
        }
    ],
    price: Number, 
    description: String,
    location: String,

    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

// middleware to delete
campgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.review
            }
        })
    }
})

module.exports = mongoose.model('campground', campgroundSchema);