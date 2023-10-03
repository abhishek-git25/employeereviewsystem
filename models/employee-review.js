const mongoose = require('mongoose');

const employeeReviewSchema = new mongoose.Schema({
    employeeId: {
        type: Object
    },
    reviewDate: {
        type: String
    },
    rating: {
        type: Number
    },
    reviewcomments: {
        type: String
    }

}, {
    timestamps: true
})

const employeeReview = mongoose.model('employeeReview' , employeeReviewSchema)

module.exports = employeeReview