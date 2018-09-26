# haven
## Find your next room, without leaving your room.

## Development Setup
1. Download the ssh key from https://drive.google.com/open?id=13FFUuTq7vbPf05DDwIOKGF9kXrs9OQ_f and save it at `key.pem`
2. Run `chmod 400 key.pem`.
3. Run `bash scripts/setup.sh` from root, which runs npm install and npm build on the client
4. Run `bash scripts/dev_server.sh` to connect to the database.
5. Run `npm run dev` to start the server, client, and connect to the database.
