pragma solidity ^0.4.21;

import "ds-test/test.sol";

import "./verifier.sol";

contract verifierTest is DSTest {
	verifier verify;

	function setUp() public {
		verify = new verifier();
	}
}
