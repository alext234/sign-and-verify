set -x

# first run to see the output
node testnet-web3.js

# second run to have some checking
node testnet-web3.js 2>&1| grep "Unhandled rejection Error"  

if [ $? == 0 ]; then
   exit 1
fi
