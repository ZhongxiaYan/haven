root=`pwd`
cd "$root" && nodemon server.js &
cd "$root/client" && npm run watch &
bash "$root/scripts/dev_server.sh" &
wait $(jobs -p)
