pragma solidity ^0.4.21;

contract verifier {

	function getSignAddress(bool hasPrefix, bytes32 msgHash, uint8 v, bytes32 r, bytes32 s) external pure returns (address) {
		// this prefix is needed when signing via geth client
		// https://github.com/ethereum/go-ethereum/issues/3731
		bytes memory prefix = "\x19Ethereum Signed Message:\n32";
		bytes32 hash;
		if (hasPrefix) {
			hash=keccak256(prefix, msgHash);
		} else {
			hash=msgHash;
		}
		 

		return ecrecover(hash, v, r, s);
	}

	function isSigned(bool hasPrefix, address _addr, bytes32 msgHash, uint8 v, bytes32 r, bytes32 s) external pure returns (bool) {
		bytes memory prefix = "\x19Ethereum Signed Message:\n32";
		bytes32 hash;
		if (hasPrefix) {
			hash=keccak256(prefix, msgHash);
		} else {
			hash=msgHash;
		}
		 

		return ecrecover(hash, v, r, s) == _addr;
	}

}
