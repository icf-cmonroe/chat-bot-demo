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
    res.render('chat', { title: 'Chat Bot' });
};