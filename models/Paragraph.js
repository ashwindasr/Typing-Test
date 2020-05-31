const mongoose = require('mongoose');
const {Schema} = mongoose;

const paragraph_schema = new Schema({
    title: String,
    text: String,
    no_of_characters: Number,
    no_of_words: Number,
    author: String,
    added_on: { type: Date, default: Date.now },
    // comments: [{ body: String, date: Date }],
    active: Boolean
})

mongoose.model('paragraph', paragraph_schema);