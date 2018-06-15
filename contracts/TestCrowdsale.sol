pragma solidity ^0.4.13;

import "./Crowdsale.sol";

contract TestCrowdsale is Crowdsale {
  constructor() public {
    saleDate = now;
    endDate = saleDate + 1 hours;

    saleState = state.pendingStart;

    ethToTokenConversion = 1;

    maxTokenSupply = 8000000000 ether;            // 8,000,000,000 tokens
    companyTokens = 600000000 ether;              // 20% company reserve, 20% team + advisors, 10% contributors + authors

    // total tokens available for public token sale: 1,200,000,000
    // tokens available for purchase: 1,119,311,124
    // bonus tokens: 80,688,876
    maxSaleWithoutBonusCap = 1119311124 ether;    
    tier1 = 260869565 ether;                      // allocated tokens for this tier (bonus tokens not included)
    tier2 = 272727273 ether;                      // allocated tokens for this tier (bonus tokens not included)
    tier3 = 285714286 ether;                      // allocated tokens for this tier (bonus tokens not included)

    tier4 = 300000000 ether;                      // allocated tokens for this tier (bonus tokens not included)
  }
}
