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
        for(var i = 0; i < msg.entry.length; i++) {
        	var pageEntry = msg.entry[i];
            // Iterate over each message and create message for botkit api
            console.log('page entry: ' + JSON.stringify(pageEntry));
            console.log('messaging length: ' + pageEntry.messaging.length);
            console.log('first message: ' + JSON.stringify(pageEntry.messaging[0]);
            for(var j = 0; j < pageEntry.messaging.length; j++) {
                cosnole.log('entered second loop');
                var message = pageEntry.messaging[j];
                // Received a normal message
                if (message.message) {
                    message = {
                        text: message.message.text,
                        user: message.sender.id,
                        channel: message.sender.id,
                        timestamp: message.timestamp,
                        seq: message.message.seq,
                        mid: message.message.mid,
                        attachments: message.message.attachments
                    }

                    // Save user
                    createUser(message.sender.id, message.timestamp)
                        // Send message to bot controller
                    controller.receiveMessage(bot, message)
                }
                // User clicks postback action (button)
                else if (message.postback) {
                    message = {
                            payload: message.postback.payload,
                            user: message.sender.id,
                            channel: message.sender.id,
                            timestamp: message.timestamp
                        }
                    // Send postback to bot controller
                    controller.trigger('facebook_postback', [bot, message])
                    // Send message to bot controller
                    message = {
                        text: message.postback.payload,
                        user: message.sender.id,
                        channel: message.sender.id,
                        timestamp: message.timestamp
                    }

                    controller.receiveMessage(bot, message)
                }
                // "Send to Messanger" plugin support
                else if (message.optin) {
                    message = {
                        optin: message.optin,
                        user: message.sender.id,
                        channel: message.sender.id,
                        timestamp: message.timestamp
                    }

                    // Save user
                    createUser(message.sender.id, message.timestamp)

                    controller.trigger('facebook_optin', [bot, message])
                }
                // Message delivered callback
                else if (message.delivery) {
                    message = {
                        optin: message.delivery,
                        user: message.sender.id,
                        channel: message.sender.id,
                        timestamp: message.timestamp
                    }

                    controller.trigger('message_delivered', [bot, message])
                } else {
                    controller.log('Got an unexpected message from Facebook: ', message)
                }
            }
        }
    }
}

exports.handler = handler;