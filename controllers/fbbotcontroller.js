// Init dependencies
var botkit = require('botkit')
var mongodbDriver = require('botkit-storage-mongo')({
    mongoUri: process.env.MONGODB_URI
}); // Botkit mongodb driver
var request = require('request');

// Init controller
var controller = botkit.facebookbot({
    debug: true,
    access_token: process.env.PAGE_ACCESS_TOKEN,
    verify_token: process.env.VERIFY_TOKEN,
    storage: mongodbDriver
});

// Init bot
var bot = controller.spawn({});

// Triggered by send-to-messenger plugin
controller.on('facebook_optin', function(bot, message) {
    bot.reply(message, 'Welcome, friend');
});

// User sends greetings
controller.hears(['hello', 'hi', 'hey'], 'message_received', function(bot, message) {
    console.log('Greeting received');
    bot.reply(message, 'Hey there.');
});

// User says anything else
controller.hears('(.*)', 'message_received', function(bot, message) {
    bot.reply(message, 'you said ' + message.match[1]);
});

// Facebook webhook handler
var handler = function(msg) {
    console.log('Received request: ' + JSON.stringify(msg));
    // Ensure there is a page subscription
    if (msg.object === 'page') {
        // Iterate over each entry
       msg.entry.forEach(function(pageEntry) {
      		console.log('entered first loop');
      		// Iterate over each message
      		pageEntry.messaging.forEach(function(msg) {
                console.log('entered second loop');
                // Received a normal message
                if (msg.message) {
                    console.log('Normal message received');
                    message = {
                        text: msg.message.text,
                        user: msg.sender.id,
                        channel: msg.sender.id,
                        timestamp: msg.timestamp,
                        seq: msg.message.seq,
                        mid: msg.message.mid,
                        attachments: msg.message.attachments
                    }

                    // Save user
                    createUser(msg.sender.id, msg.timestamp)
                    // Send message to bot controller
                    controller.receiveMessage(bot, message)
                    console.log('Normal message handled');
                }
                // User clicks postback action (button)
                else if (msg.postback) {
                    message = {
                            payload: msg.postback.payload,
                            user: msg.sender.id,
                            channel: msg.sender.id,
                            timestamp: msg.timestamp
                        }
                    // Send postback to bot controller
                    controller.trigger('facebook_postback', [bot, message])
                    // Send message to bot controller
                    message = {
                        text: msg.postback.payload,
                        user: msg.sender.id,
                        channel: msg.sender.id,
                        timestamp: msg.timestamp
                    }

                    controller.receiveMessage(bot, message)
                }
                // "Send to Messanger" plugin support
                else if (msg.optin) {
                    message = {
                        optin: msg.optin,
                        user: msg.sender.id,
                        channel: msg.sender.id,
                        timestamp: msg.timestamp
                    }

                    // Save user
                    createUser(msg.sender.id, msg.timestamp)

                    controller.trigger('facebook_optin', [bot, message])
                }
                // Message delivered callback
                else if (msg.delivery) {
                    message = {
                        optin: msg.delivery,
                        user: msg.sender.id,
                        channel: msg.sender.id,
                        timestamp: msg.timestamp
                    }

                    controller.trigger('message_delivered', [bot, message])
                } else {
                    controller.log('Got an unexpected message from Facebook: ', msg)
                }
            });
        });
    }
}

var createUser = function(id, timestamp) {

}

exports.handler = handler;