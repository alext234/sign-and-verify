# echo on
set -x 

export ETH_KEYSTORE=~/.dapp/testnet/8545/keystore/
export ETH_RPC_URL=http://127.0.0.1:8545

ACCOUNT1=$(seth rpc eth_accounts|sed 1p -n)
ACCOUNT2=$(seth rpc eth_accounts|sed 2p -n)


# sign a message with an account
export ETH_FROM=$ACCOUNT2
msg="Hello World"
hexData=$(seth --from-ascii $msg)
hexDataFixedSize=$(seth keccak $hexData)

signedData=$(seth sign $hexDataFixedSize)
r=0x${signedData:2:64}
s=0x${signedData:66:64}
v=0x${signedData:130:2}


# create the contract 
export ETH_FROM=$ACCOUNT1
export ETH_GAS=4500000

echo "" > empty-password.txt
verifier=$(dapp create  verifier -S empty-password.txt)


# call the contract to verify the message
isSigned=$(seth call $verifier \
	'isSigned(address,bytes32,uint8,bytes32,bytes32)(bool)' \
	$ACCOUNT2 \
	$hexDataFixedSize \
	$(seth --to-word $v) \
	$r \
	$s)


