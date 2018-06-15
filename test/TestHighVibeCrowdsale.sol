pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/HighVibeToken.sol";
import "../contracts/TestCrowdsale.sol";

contract TestHighVibeCrowdsale {

  function testBuyingTokens() {
    TestCrowdsale _crowdsale = TestCrowdsale(DeployedAddresses.TestCrowdsale());

    _crowdsale.send(1);


  }

}