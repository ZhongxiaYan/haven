root=`pwd`
cd "$root" && nodemon --ignore client/ --ignore sessions/ server.js &
cd "$root/client" && npm run dev &
wait $(jobs -p)
