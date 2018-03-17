pragma solidity ^0.4.21;

contract verifier {

	function getSignAddress(bytes32 msgHash, uint8 v, bytes32 r, bytes32 s) external pure returns (address) {
		return ecrecover(msgHash, v, r, s);
	}

	function isSigned(address _addr, bytes32 msgHash, uint8 v, bytes32 r, bytes32 s) external pure returns (bool) {
		return ecrecover(msgHash, v, r, s) == _addr;
	}

}
