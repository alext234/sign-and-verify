[![Build Status](https://travis-ci.org/alext234/sign-and-verify.svg?branch=sign-with-web3)](https://travis-ci.org/alext234/sign-and-verify)

# Signing and Verifying with Ethereum

This project demonstrate a simple example of signing a message locally (off-chain)
with the JSON RPC `eth_sign`. The signature can be verified by through a 
smart contract which makes uses of the Solidity's `ecrecover`  function.


# Starting a testnet

A testnet can be simply started with this command 

```
dapp testnet --accounts 2
```
2 accounts will be created in the testnet. We can use one to sign a message and then 
use the other to deploy the contract and interact with it.


# Signing a message 

Starting with a message

```
msg="Hello World"
```

We convert to hex format 

```
hexData=$(seth --from-ascii $msg)
```

And then get the keccak256 hash of it 

```
hexDataFixedSize=$(seth keccak $hexData)
```

We can now sign it with `seth sign` which will make use of the 
JSON-RPC [eth_sign](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_sign).
 

```
export ETH_KEYSTORE=~/.dapp/testnet/8545/keystore/
export ETH_RPC_URL=http://127.0.0.1:8545

export ETH_FROM=<account_address to sign>
signedData=$(seth  sign  $hexDataFixedSize )
```

The signature should be broken down into 3 components `v, r, s` 
(these are part of the ECDSA standard signature).

```
r=0x${signedData:2:64}
s=0x${signedData:66:64}
v=0x${signedData:130:2}
```

`v, r, s` will be passed to a smart contract for verification.

# Verifying the signature

A smart contract is implemented in [verifier.sol](src/verifier.sol).

The first step is to deploy it 

```
export ETH_FROM=<account_address to deploy>
export ETH_GAS=4500000

verifier=$(dapp create  verifier)

```

The `isSigned` function of the contract can be called to verify the 
signature. It returns `true` if the signature is signed 
by the given address.


```
isSigned=$(seth call $verifier \
	'isSigned(address,bytes32,uint8,bytes32,bytes32)(bool)' \
	<account address that was used to sign> \
	$hexDataFixedSize \
	$(seth --to-word $v) \
	$r \
	$s)

```

# Signing and verifying with `web3`

The script [testnet-web3.js](testnet-web3.js) comes with the following flow:

- Get list of accounts (at least 2 are expected).
- Sign a message with one account.
- Deploy verifier contract with another account.
- Call the contract `isSigned` method to verify the signature.
- In this branch, the execution is via nodejs at the console. 
There is another branch where I am working on which is to sign 
at the browser with the help of Metamask. 


The following versions `nodejs` and `web3` have been tested:

```
> node -v
v9.8.0
> npm view web3 version
1.0.0-beta.33
```

To run the script:

- Make sure the contract is compiled:

```
dapp build
```

- Run a testnet with 2 accounts, e.g. with `dapp` (on a separate console):

```
dapp testnet --accounts 2
```

- Run the script:


```
node testnet-web3.js
```

# Signing and verifying with `web3` at the browser
TODO
