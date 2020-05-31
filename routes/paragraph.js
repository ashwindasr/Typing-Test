const mongoose = require('mongoose');
const Paragraph = mongoose.model('paragraph');

module.exports = (app) => {

  app.get('/api/get_string', async (req, res) => {
    if(!req.session.user_id) {
      req.session.user_id = (new Date()).getTime().toString(36);
    }
    let paragraph = await Paragraph.find();

	Paragraph.count().exec(function (err, count) {
		// Get a random entry
		var random = Math.floor(Math.random() * count)

		Paragraph.findOne().skip(random).exec(
		function (err, result) {
			return res.status(200).send(result);
		})
	})
  });

  app.post('/api/put_string', async (req, res) => {
    let paragraph = await Paragraph.create(req.query);
    // let paragraph = await Paragraph.deleteMany(); // to delte all data
    console.log(req.query);
    return res.status(201).send({
      error: false,
      paragraph
    })
  })
}