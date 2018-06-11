pragma solidity ^0.4.13;

import "./Crowdsale.sol";

contract TestCrowdsale is Crowdsale {
  constructor() public {
    presaleDate = now + 1 hours;
    saleDate = now;
    endDate = saleDate + 1 hours;

    saleState = state.pendingStart;

    ethToTokenConversion = 1;                 // 1 ETH == 26,950 HighVibe tokens

    maxTokenSupply = 2400000000 ether;            // 2,400,000,000 tokens
    companyTokens = 600000000 ether;              // 20% company reserve, 20% team + advisors, 10% contributors + authors

    maxPresaleWithoutBonus = 1011739130 ether;
    maxPresaleCap = 1200000000 ether;             // tokens allocated to pre-sale
    tier1 = 3 ether;                      // allocated tokens for this tier (bonus tokens not included)
    tier2 = 4 ether;                      // allocated tokens for this tier (bonus tokens not included)
    tier3 = 5 ether;                      // allocated tokens for this tier (bonus tokens not included)

    maxSaleWithoutBonus = 1137511326 ether;
    maxSaleCap = 1200000000 ether;                // tokens allocated to main sale 
    tier4 = 1 ether;                      // allocated tokens for this tier (bonus tokens not included)
    tier5 = 2 ether;                      // allocated tokens for this tier (bonus tokens not included)
    tier6 = 3 ether;                      // allocated tokens for this tier (bonus tokens not included)
    tier7 = 4 ether;
  }
}
