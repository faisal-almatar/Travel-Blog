const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new mongoose.Schema({
    content: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true})

const postScema = new mongoose.Schema({
    title: String,
    description: String,
    location: String,
    image: String,
    poster: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [commentSchema],
}, {timestamps: true})

module.exports = mongoose.model('Post', postScema)