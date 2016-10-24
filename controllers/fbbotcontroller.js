// Init dependencies
var botkit = require('botkit')
var mongodbDriver = require('botkit-storage-mongo')({mongoUri: process.env.MONGODB_URI}); // Botkit mongodb driver
var request = require('request');

// Init controller
var controller = botkit.facebookbot({
	debug: true,
  	access_token: process.env.PAGE_ACCESS_TOKEN,
  	verify_token: process.env.VERIFY_TOKEN,
	storage: mongodbDriver
});

// Init bot
var bot = controller.spawn({
});

// Triggered by send-to-messenger plugin
controller.on('facebook_optin', function (bot, message) {
  bot.reply(message, 'Welcome, friend');
});

// User sends greetings
controller.hears(['hello', 'hi', 'hey'], 'message_received', function (bot, message) {
  bot.reply(message, 'Hey there.');
});

// User says anything else
controller.hears('(.*)', 'message_received', function (bot, message) {
  bot.reply(message, 'you said ' + message.match[1]);
});

// Facebook webhook handler
var handler = function (msg) {
	console.log('Received request: ' + JSON.stringify(msg));
}

exports.handler = handler;