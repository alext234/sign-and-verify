# echo on

# sleep is needed so that when `seth sign` is called, 
# the account is unlocked (maybe geth takes time).
# sleep use is not reliable for now
sleep 2

set -x 

export ETH_KEYSTORE=~/.dapp/testnet/8545/keystore/
export ETH_RPC_URL=http://127.0.0.1:8545

ACCOUNT1=$(seth rpc eth_accounts|sed 1p -n)
ACCOUNT2=$(seth rpc eth_accounts|sed 2p -n)
echo "" > empty-password.txt

# sign a message with an account
export ETH_FROM=$ACCOUNT2
msg="Hello World"
hexData=$(seth --from-ascii $msg)
hexDataFixedSize=$(seth keccak $hexData)
signedData=$(seth  sign  $hexDataFixedSize )

r=0x${signedData:2:64}
s=0x${signedData:66:64}
v=0x${signedData:130:2}


# create the contract 
export ETH_FROM=$ACCOUNT1
export ETH_GAS=4500000

verifier=$(dapp create  verifier -S empty-password.txt)


# call the contract to get the signer address
signAddr=$(seth call $verifier \
	'getSignAddress(bool,bytes32,uint8,bytes32,bytes32)(address)' \
	true \
	$hexDataFixedSize \
	$(seth --to-word $v) \
	$r \
	$s)


if [ "0x$signAddr" != "$ACCOUNT2" ]
then
	exit 1
fi

# call the contract to verify the message
isSigned=$(seth call $verifier \
	'isSigned(bool,address,bytes32,uint8,bytes32,bytes32)(bool)' \
	true \
	$ACCOUNT2 \
	$hexDataFixedSize \
	$(seth --to-word $v) \
	$r \
	$s)

if [ "$isSigned" != "true" ]
then
	exit 1
fi
