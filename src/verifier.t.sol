pragma solidity ^0.4.21;

import "ds-test/test.sol";

import "./verifier.sol";

contract verifierTest is DSTest {
    verifier verify;

    function setUp() public {
        verify = new verifier();
    }

    function testFail_basic_sanity() public {
        assertTrue(false);
    }

    function test_basic_sanity() public {
        assertTrue(true);
    }
}
