var fbHandler = require('../controllers/fbbotcontroller').handler

/*
 * GET home page.
 */

exports.home = function (req, res) {
    res.render('index', { title: 'Chat Bot' });
};

/*
 * GET chat page.
 */

exports.chat = function (req, res) {
    res.render('index', { title: 'Chat Bot' });
};

/*
 * POST Subscribe webhook
 */ 
exports.fbSubscribeWebhook = function(req, res) {
    console.log(JSON.stringify(req));
    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
      res.send(req.query['hub.challenge']);
    }
    else {
      res.send('Incorrect verify token');
    }
};

exports.fbReceivedMsg = function(req, res) {
	fbHandler(req.body);
	res.send(200);
}
