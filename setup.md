### Setup Heroku Deploy
* After forking and cloning this repository to local
![alt text](https://github.com/kvbutler/images/blob/master/deploy-button.png "Deploy to heroku")
* Name the app or let Heroku generate an app name, click deploy
* After deployment click "Manage App"
* Click the "Deploy" tab
* Under deployment method click "Github" and connect your forked repository
![alt text](https://github.com/kvbutler/images/blob/master/connect-github.png "Connect github")

### Create a Facebook Page for your Bot

* [Create Facebook Page](https://www.facebook.com/pages/create/)
* Click "Brand or Product" and select "App Page" from the dropdown
* Name your page and click get started
* Skip through the next four screens or fill in relevant information

### Create a Facebook App

* [Go to Facebook Developers Console](https://developers.facebook.com/)
![alt text](https://github.com/kvbutler/images/blob/master/add-facebook-app.png "Add Facebook app")
* Add the following info in the "Create a New App ID" Popup
	- "Display Name": Your choice
	- "Contact Email": Your email
	- "Category": "Apps for Pages"
* Click "Create App ID"

### Add Required Products to App

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
	- For "VALUE" type: Anything just remember what it was for later steps
* Config var 3:
	- For "KEY" type: "HOST_NAME"
	- For "VALUE" type: <your heroku app name>.herokuapp.com
* Config var 4:
	- During demo

### Setup Webhooks for Page Subscription

![alt text](https://github.com/kvbutler/images/blob/master/setup-webhook.png "Setup Webhooks")
* Fill in the following fields
![alt text](https://github.com/kvbutler/images/blob/master/webhook-options.png "Webhook options")
* Click "Verify and Save"

### Subscribe page events
* In the Facebook developers console under "Webhooks" Select the previously created page in the "Select a Page" dropdown
![alt text](https://github.com/kvbutler/images/blob/master/subscribe-page-events.png "Subscribe page")subscribe-page-events.png
* Congrats! Services Connected. ![alt text](https://github.com/kvbutler/images/blob/master/robot-happy.png "Success options")