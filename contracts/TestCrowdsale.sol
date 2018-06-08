pragma solidity ^0.4.13;

import "./Crowdsale.sol";

contract TestCrowdsale is Crowdsale {
  function TestCrowdsale() public {
    presaleDate = 1530932400;   
    saleDate = presaleDate + 32 days;
    endDate = saleDate + 32 days;

    state currentState = state.presaleStart;

    ethToTokenConversion = 1;

    maxTokenSupply = 10.3 ether;
    companyTokens = 5 ether;             // allocation to company, private presale and users (marketing)

    uint maxCommunityWithoutBonusCap = 2 ether;
    uint maxCommunityCap = 2.3 ether;
    uint maxCrowdsaleCap = 3 ether;

    maxContribution = 1 ether;                  // maximum contribution during community round
  }
}
