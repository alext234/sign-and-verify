# echo on
set -x 

ETH_KEYSTORE=~/.dapp/testnet/8545/keystore/
ETH_RPC_URL=http://127.0.0.1:8545

ACCOUNT1=$(seth rpc eth_accounts|sed 1p -n)
ACCOUNT2=$(seth rpc eth_accounts|sed 2p -n)
ETH_FROM=$ACCOUNT1

# deploy the verifier contract
# TODO


# sign a message with  account

ETH_FROM=$ACCOUNT2
msg="Hello World"
hexData=$(seth --from-ascii $msg)
signedData=$(seth sign $hexData)
r=0x${signedData:2:66}
s=0x${signedData:66:130}
v=0x${signedData:130:132}


# call the contract to verify the message
# TODO
