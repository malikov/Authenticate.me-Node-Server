Authenticate.me app Back end node server + Parse.com database
================================================================

This project is to support the front end code for [Authenticate.me-client-cordova-ionic](https://github.com/malikov/Authenticate.me-client-cordova-ionic).

## Using this project

You'll need to download nodejs

### 1. Parse.com / instagram / twitter accounts

* This project uses parse.com as a database therefore you'll need to create an account at [parse.com](https://www.parse.com/).

Once your account created, create an app (The name of the app doesn't matter, you'll only need the api keys, found under settings > keys).
 
* You'll need to create an instagram app (go to [http://instagram.com/developer/](http://instagram.com/developer/)) and a twitter app (go to [https://dev.twitter.com/overview/documentation](https://dev.twitter.com/overview/documentation) and select manage my apps) as well.


Note : if npm isn't defined you'll need to install [node](http://nodejs.org/)

### 2. Clone this repo
```bash
 git clone https://github.com/malikov/Authenticate.me-Node-Server.git
```

Then navigate to the repo :
```bash
 cd Authenticate.me-Node-Server
```

### 3. Dependencies

Run :
```bash
 npm install
```

This should install all dependencies for the project.


### 4. Configuration

in the config.js file change the appropriate configuration variables for the twitter, instagram and parse.com app.

Replace for twitter
```bash
	config.twitter.consumerKey = [YOUR TWITTER CLIENT ID];
	config.twitter.consumerSecret = [YOUR TWITTER CLIENT SECRET]
	config.twitter.callbackURL = [YOUR TWITTER URL CALLBACK];
```

Replace for instagram
```bash
	config.instagram.clientID = [YOUR INSTAGRAM CLIENT ID];
	config.instagram.clientSecret = [YOUR INSTAGRAM CLIENT_SECRET];
	config.instagram.callbackURL = [YOUR INSTAGRAM URL CALLBACK];
```

Replace for parse.com
```bash
	config.parse.appId = process.env['PARSE_API_KEY_ID'] || "HP7gg6WbhMiORnxKM5j3Nd68UxLyDuUrci3QQAo9";
	config.parse.jsKey = process.env['PARSE_API_JS_KEY'] || "kvFRxM4UZfvoc6DZFdePMqhoS60Zf3r4LAhATecr";
	config.parse.masterKey = process.env['PARSE_MASTER_KEY'] || "jYL36dQJ4mM4ndSd5T3BEe0pA0xX0NgxcoS7gHLG";
```

Then run:
```bash
	node bin/www
```

the server should launch at localhost:3000.

Note : in order to test the oauth (instagram / twitter) authentication locally you'll want to change your host file on your windows machine (or use nginx with some reverse proxy settings) to match the url used for the callback.

For instance if I was to test the app locally I'd change the host to make sure 127.0.0.1 points to authenticate-app-me.herokuapp.com (therefore accessing the server locally would yield : http://authenticate-app-me.herokuapp.com:3000 ). Then I'd change the callback url to match : authenticate-app-me.herokuapp.com:3000.


### TODO
tests

add facebook

