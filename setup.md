### Create a Facebook Page for your bot

* [Create Facebook Page](https://www.facebook.com/pages/create/)
* Click "Brand or Product" and select "App Page" from the dropdown
* Name your page and click get started
* Skip through the next four screens or fill in relevent information

### Create a Facebook App

* [Go to Facebook Developers Console](https://developers.facebook.com/)
![alt text](https://github.com/kvbutler/images/blob/master/add-facebook-app.png "Add Facebook app")
* Add the following info in the "Create a New App ID" Popup
	- "Display Name": Your choice
	- "Contact Email": Your email
	- "Category": "Apps for Pages"
* Click "Create App ID"

### Add required products to app

* In the developers console, navigate to your newly created app
![alt text](https://github.com/kvbutler/images/blob/master/add-product-to-fb-app.png "Add Product")
* Under "Product Setup" click Messenger -> "Get Started"
* Under "Token Generation" select the previously created page from the dropdown
* Click "Continue as <username>", click "OK"
* Copy page access token to clipboard

### Add Heroku "Config Variables" (Environment Variables)

* [Go to your Heroku apps page](https://dashboard.heroku.com/apps)
* Select the previously created Heroku app
![alt text](https://github.com/kvbutler/images/blob/master/add-config-var.png "Add Config Var")
* Config var 1:
	- For "KEY" type: "PAGE_ACCESS_TOKEN"
	- For "VALUE" copy the previously generated page access token
* Config var 2:
	- For "KEY" type: "VERIFY_TOKEN"
	- For "VALUE" type: Anything just remeber what it was for later steps
* Config var 3:
	- During demo

### Setup webhooks for page subscription

![alt text](https://github.com/kvbutler/images/blob/master/setup-webhook.png "Setup Webhooks")
* Fill in the following fields
![alt text](https://github.com/kvbutler/images/blob/master/webhook-options.png "Webhook options")
* Click "Verify and Save"

### Subscribe page events
* In the facebook developers console under "Webhooks" Select the previously created page in the "Select a Page" dropdown
![alt text](https://github.com/kvbutler/images/blob/master/subscribe-page-events.png "Subscribe page")subscribe-page-events.png
* Congrats! Services Connected. ![alt text](https://github.com/kvbutler/images/blob/master/robot-happy.png "Success options")