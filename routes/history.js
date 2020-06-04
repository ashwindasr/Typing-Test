const mongoose = require('mongoose');
const History = mongoose.model('history');

module.exports = (app) => {
  
  app.get('/api/history/', async (req, res) => {
    if(!req.session.user_id) {
      req.session.user_id = (new Date()).getTime().toString(36);
      return res.status(201).send({
        error: true
      })
    }
    let history = await History.find({'user_id': req.session.user_id});
    return res.status(200).send(history);
  });

  app.get('/api/history/all', async (req, res) => {
    let history = await History.find();
    var x;
    var count = 0;
    for (x in history) {
      if (history[x].wpm != undefined) {
        count += parseInt(history[x].wpm) < 0 ? 0 : 1;
        // console.log(x, parseInt(history[x].wpm), count);
      }
    }
    percentile = parseInt(x) > 0  ? count / (parseInt(x) + 1) : count;
    percentile = Math.round(percentile * 100);
    return res.status(200).send({percentile});
  });

  app.post('/api/history', async (req, res) => {
    if(!req.session.user_id) {
      req.session.user_id = (new Date()).getTime().toString(36);
    }
    var params = req.body;
    // console.log(req.body);
    params.user_id = req.session.user_id;
    let history = await History.create(params);
    return res.status(201).send({
      error: false,
      history
    })
  })
}