// Init dependencies
var botkit = require('botkit')
var mongodbDriver = require('botkit-storage-mongo')({
    mongoUri: process.env.MONGODB_URI
}); // Botkit mongodb driver
var request = require('request');
var url = 'https://' + process.env.HOST_NAME + '/';
var numberOfComicsAvailable = 1750; // The number of comics available on comic api

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

// Triggered by a button post_back
controller.on('facebook_postback', function(bot, message) {
    var reply = '';
    switch(message.payload) {
    	case 'postback_comic':
    		reply = getComic(function(comicReply){
    			bot.reply(message, comicReply);
    		});
    		break;
    	case 'postback_image_robot':
    		reply = createImageMessage(url + 'images/robot-design.png');
    		bot.reply(message, reply);
    		break;
    }
});

// User sends greetings
controller.hears(['hello', 'hi', 'hey'], 'message_received', function(bot, message) {
    bot.reply(message, 'Hey there.');
});

// User wants to see buttons example
controller.hears(['button(s?)'], 'message_received', function(bot, message) {
    bot.reply(message, createButtonMessage());
});

// User wants to see image example
controller.hears(['image', 'what do you look like'], 'message_received', function(bot, message) {
    bot.reply(message, createImageMessage(url + 'images/robot-design.png'));
});

// User wants to see audio example
controller.hears(['speak', 'talk', 'audio'], 'message_received', function(bot, message) {
    bot.reply(message, createAudioMessage(url + 'audio/bot-speak.mp3'));
});

// User wants to fight
controller.hears(['fight', 'scrap', 'bro'], 'message_received', function(bot, message) {
    bot.reply(message, 'Get at me bro');
});

// User wants to see random comic
controller.hears(['comic'], 'message_received', function(bot, message) {
    getComic(function(reply) {
    	bot.reply(message, reply);
    });
});

// User wants to conversation history
controller.hears(['conversation'], 'message_received', function(bot, message) {
    getUserData(message.user);
});


// User says anything else
controller.hears('^(?!postback).*$', 'message_received', function(bot, message) {
    bot.reply(message, 'I am not able to handle your message, ' + message.text);
});

// Facebook webhook handler
var handler = function(msg) {
    console.log('Received request: ' + JSON.stringify(msg));
    // Ensure there is a page subscription
    if (msg.object === 'page') {
        // Iterate over each entry
       msg.entry.forEach(function(pageEntry) {
      		// Iterate over each message
      		pageEntry.messaging.forEach(function(msg) {
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
            title: "Show me a comic",
            payload: "postback_comic"
          }, {
            type: "postback",
            title: "Send me an image",
            payload: "postback_image_robot"
          }]
        }
      }
    };
  return attachment;
}

var getComic = function(callback) {
	var randComic = Math.ceil(numberOfComicsAvailable * Math.random()) + 1;
	var randomComicUrl = 'http://xkcd.com/' + randComic + '/info.0.json';
	request({url: randomComicUrl, json: true }, function (error, response, body) {
  	if (!error && response.statusCode == 200) {
    	var imageUrl = body.img;
    	return callback(createImageMessage(imageUrl));
  	} else {
  		console.log(error);
  		return {};
  	}
});
}

var createImageMessage = function(imageUrl) {
    return { attachment: {
    	type: "image",
    	payload: {
        	url: imageUrl
        }
    }
}
}

var createAudioMessage = function(audioUrl) {
  return { attachment: {
        type: "audio",
        payload: {
          url:audioUrl
        }
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
    	controller.storage.users.save({id: id, created_at: timestamp})
    }
});
}

var getUserData = function(id) {
	controller.storage.users.get(id, function(err, userData) {
		console.log(JSON.stringify(userData));
	});
}

exports.handler = handler;