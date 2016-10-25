// Init dependencies
var botkit = require('botkit')
var mongodbDriver = require('botkit-storage-mongo')({
    mongoUri: process.env.MONGODB_URI
}); // Botkit mongodb driver
var request = require('request');
var url = 'https://' + req.get('host');

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

// User wants to see buttons example
controller.hears(['buttons'], 'message_received', function(bot, message) {
    bot.reply(message, createButtonMessage());
});

// User wants to see image example
controller.hears(['image'], 'message_received', function(bot, message) {
    bot.reply(message, createImageMessage(url + 'images/robot-design.png'));
});

// User wants to hear audio example


// User says anything else
controller.hears('(.*)', 'message_received', function(bot, message) {
    bot.reply(message, 'I am not able to handle your message, ' + message.match[1]);
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

// Creates a sample button message
var createButtonMessage = function() {
  var attachment = {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: "An example button group",
          buttons:[{
            type: "web_url",
            url: "https://github.com/kvbutler/chat-bot-demo",
            title: "Open Git Page"
          }, {
            type: "postback",
            title: "Tell a joke",
            payload: "trigger_joke"
          }, {
            type: "postback",
            title: "Send me an image",
            payload: "send_robot_image"
          }]
        }
      }
    };
  return attachment;
}

var createImageMessage = function(imageUrl) {
    console.log('Image url: ' + imgUrl);
    return attachment: {
    	type: "image",
    	payload: {
        	url: imageUrl
        }
    }
}

var createAudioMessage = function(audioUrl) {
  return attachment: {
        type: "audio",
        payload: {
          url:audioUrl
        }
	}
}


var createUser = function(id, timestamp) {
	// Get user
	controller.storage.users.get(id, function (err, user) {
    if (err) {
      	console.log(err)
    }
    // If null create new user
    else if (!user) {
    	controller.storage.users.save({id: id, created_at: ts})
    }
});
}

exports.handler = handler;