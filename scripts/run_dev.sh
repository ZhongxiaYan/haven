root=`pwd`
cd "$root" && nodemon --ignore client/ --ignore sessions/ server.js &
cd "$root/client" && npm run dev &
bash "$root/scripts/dev_server.sh" &
wait $(jobs -p)
