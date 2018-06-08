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

    presaleDate = 1530932400;         // pre-sale starts [7/7 midnight] 
    saleDate = presaleDate + 32 days; // 32 days later pre-sale starts [8/8 midnight]
    endDate = saleDate + 32 days;     // 32 days after main sale starts [9/9 midnight]

    saleState = state.pendingStart;

    ethToTokenConversion = 26950;                 // 1 ETH == 26,950 HighVibe tokens

    maxTokenSupply = 2400000000 ether;            // 2,400,000,000 tokens
    companyTokens = 600000000 ether;              // 20% company reserve, 20% team + advisors, 10% contributors + authors

    maxPresaleWithoutBonus = 1011739130 ether;
    maxPresaleCap = 1200000000 ether;             // tokens allocated to pre-sale
    tier1 = 240000000 ether;                      // allocated tokens for this tier (bonus tokens not included)
    tier2 = 250000000 ether;                      // allocated tokens for this tier (bonus tokens not included)
    tier3 = 521739130 ether;                      // allocated tokens for this tier (bonus tokens not included)

    maxSaleWithoutBonus = 1137511326 ether;
    maxSaleCap = 1200000000 ether;                // tokens allocated to main sale 
    tier4 = 272727273 ether;                      // allocated tokens for this tier (bonus tokens not included)
    tier5 = 279069767 ether;                      // allocated tokens for this tier (bonus tokens not included)
    tier6 = 285714286 ether;                      // allocated tokens for this tier (bonus tokens not included)
    tier7 = 300000000 ether;
  }
}
