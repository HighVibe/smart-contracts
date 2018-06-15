pragma solidity ^0.4.13;

import "./Crowdsale.sol";

contract TestCrowdsale is Crowdsale {
    string public website;
    string public medium;
    string public telegram;

  constructor() public {
    website = "https://www.highvibe.network";
    medium = "https://www.medium.com/highvibe-network/";
    telegram = "https://t.me/highvibenetworktoken";

    saleDate = now;         // pre-sale starts [7/7 midnight] 
    endDate = saleDate + 32 days;     // 32 days after main sale starts [9/9 midnight]

    saleState = state.pendingStart;

    ethToTokenConversion = 1 ether;                 // 1 ETH == 26,950 HighVibe tokens

    maxTokenSupply = 5 ether;            // 8,000,000,000 tokens
    companyTokens = .7 ether;              // 20% company reserve, 20% team + advisors, 10% contributors + authors

    maxSaleWithoutBonus =  4 ether;
    maxSaleCap = 4.3 ether;                // tokens allocated to main sale 
    tier1 = 1.15 ether;                      // allocated tokens for this tier (bonus tokens not included)
    tier2 = 1.1 ether;                      // allocated tokens for this tier (bonus tokens not included)
    tier3 = 1.05 ether;                      // allocated tokens for this tier (bonus tokens not included)

    tier4 = 1 ether;                      // allocated tokens for this tier (bonus tokens not included)
  }
}
