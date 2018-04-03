set -x

# second run to have some checking
node testnet-web3.js 2>&1| grep "Error:"  

if [ $? == 0 ]; then
   exit 1
fi
