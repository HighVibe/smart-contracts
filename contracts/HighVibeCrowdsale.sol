pragma solidity ^0.4.13;

import "./Crowdsale.sol";

contract HighVibeCrowdsale is Crowdsale {
    string public website;
    string public medium;
    string public telegram;

  constructor() public {
    website = "https://www.highvibe.network";
    medium = "https://www.medium.com/highvibe-network/";
    telegram = "https://t.me/highvibenetworktoken";

    saleDate = 1536454800;         // unix epoch public sale start date [9/9/2018 1am] 
    endDate = saleDate + 32 days;     // 32 days after main sale starts [9/9 midnight]

    saleState = state.pendingStart;

    ethToTokenConversion = 26950;                 // 1 ETH == 26,950 HighVibe tokens

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
