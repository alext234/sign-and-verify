pragma solidity ^0.4.21;

contract verifier {

	function getSignAddress(bytes32 msgHash, uint8 v, bytes32 r, bytes32 s) external pure returns (address) {
		bytes memory prefix = "\x19Ethereum Signed Message:\n32";
		bytes32 prefixedHash = keccak256(prefix, msgHash);

		return ecrecover(prefixedHash, v, r, s);
	}

	function isSigned(address _addr, bytes32 msgHash, uint8 v, bytes32 r, bytes32 s) external pure returns (bool) {
		bytes memory prefix = "\x19Ethereum Signed Message:\n32";
		bytes32 prefixedHash = keccak256(prefix, msgHash);

		return ecrecover(prefixedHash, v, r, s) == _addr;
	}

}
