const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config()

// session
const session = require('express-session');

// import models
require('./models/History');
require('./models/Paragraph');

const app = express();
app.use(bodyParser.json());

// app.use(cookieParser());
app.use(session({
	secret: 'keyboard cat',
	resave: true,
	saveUninitialized: true
}));

// import routes
require('./routes/history')(app);
require('./routes/paragraph')(app);

// if(!req.session.user_id) {
// 	req.session.user_id = (new Date()).getTime().toString(36);
// }

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  const path = require('path');
  app.get('*', (req,res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

// mongodb
const db_url = process.env.DB_URL;
mongoose.connect(db_url, {useNewUrlParser: true, useUnifiedTopology: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log('mongodb connected');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`)
});