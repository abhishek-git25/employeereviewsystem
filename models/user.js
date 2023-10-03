const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    position: {
        type: String
    },
    department: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    userType: {
        type: String,
        enum: ['admin', 'employee'],
        default: 'employee'
    }

}, {
    timestamps: true
})

const User = mongoose.model('User', userSchema);

module.exports = User;