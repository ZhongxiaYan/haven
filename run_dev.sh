root="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
cd "$root/server" && nodemon server.js &
cd "$root/client" && npm run watch &
bash "$root/dev_server.sh" &
wait $(jobs -p)
