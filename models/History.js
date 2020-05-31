const mongoose = require('mongoose');
const {Schema} = mongoose;

const history_schema = new Schema({
	user_id: String,
	wpm: Number,
	cpm: Number,
	accuracy: Number,
    description: String,
})

mongoose.model('history', history_schema);