# Haven
### Find your next room, without leaving your room.

## Development Setup
1. Download Node and NPM from https://www.npmjs.com/get-npm. Run `sudo npm install nodemon -g` to install nodemon globally for development.
2. Install MongoDB from https://docs.mongodb.com/manual/administration/install-community/ and start the `mongod` process (e.g. `sudo systemctl start mongod`)
3. Copy `.env-template` into `.env` and update with your server's IP address, username `<user>`, and password `<password>`, and any keys. Also do so for `scripts/mongo.sh`. Authenticating with Google and Facebook requires domain names and setting up the proper auth keys. The map on the home page requires the `<client_key>` in `client/src/components/pages/HomePage.js` to be substituted with a client key with the Google Maps Javascript API.
4. Enable authentication for MongoDB by running `mongo --port 27017` then running
```
use haven
db.createUser({user: '<user>', pwd: '<password>', roles: ['dbOwner']})
```
5. Change AWS security group's inbound rules to allow Custom TCP from `0.0.0.0` on ports `27017` (for MongoDB) and `5555` (for the server).
6. Edit `/etc/mongod.conf` as follows and run `sudo systmctl restart mongod`. Run `bash scripts/mongo.sh` to make sure that you can enter the database.
```
net:
#    bindIp: 127.0.0.1 remove this line
    bindIp: 0.0.0.0

# uncomment this
security:
    authorization: enabled
```
7. Run `npm run dev` or `npm run prod` as desired

## Owners
Go to `<domain>/owner` to see the owner page.

## Renters
### Property Page

### Calendar