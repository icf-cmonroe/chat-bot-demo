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
	// Ensure there is a page subscription
	if (msg.object === 'page') {
		// Iterate over each entry and create message for botkit api
		data.entry.forEach(function(pageEntry) {
		// Received a normal message
        if (pageEntry.message) {
          message = {
            text: pageEntry.message.text,
            user: pageEntry.sender.id,
            channel: pageEntry.sender.id,
            timestamp: pageEntry.timestamp,
            seq: pageEntry.message.seq,
            mid: pageEntry.message.mid,
            attachments: pageEntry.message.attachments
          }

          // Save user
          createUser(pageEntry.sender.id, pageEntry.timestamp)
          // Send message to bot controller
          controller.receiveMessage(bot, message)
        }
        // User clicks postback action (button)
        else if (pageEntry.postback) {
          message = {
            payload: pageEntry.postback.payload,
            user: pageEntry.sender.id,
            channel: pageEntry.sender.id,
            timestamp: pageEntry.timestamp
          }
          // Send postback to bot controller
          controller.trigger('facebook_postback', [bot, message])
          // Send message to bot controller
          message = {
            text: pageEntry.postback.payload,
            user: pageEntry.sender.id,
            channel: pageEntry.sender.id,
            timestamp: pageEntry.timestamp
          }

          controller.receiveMessage(bot, message)
        }
        // "Send to Messanger" plugin support
        else if (pageEntry.optin) {
          message = {
            optin: pageEntry.optin,
            user: pageEntry.sender.id,
            channel: pageEntry.sender.id,
            timestamp: pageEntry.timestamp
          }

          // Save user
          createUser(pageEntry.sender.id, pageEntry.timestamp)

          controller.trigger('facebook_optin', [bot, message])
        }
        // Message delivered callback
        else if (pageEntry.delivery) {
          message = {
            optin: pageEntry.delivery,
            user: pageEntry.sender.id,
            channel: pageEntry.sender.id,
            timestamp: pageEntry.timestamp
          }

          controller.trigger('message_delivered', [bot, message])
        }
        else {
          controller.log('Got an unexpected message from Facebook: ', pageEntry)
}
		});
	}
}

exports.handler = handler;