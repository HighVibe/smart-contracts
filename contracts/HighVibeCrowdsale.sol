pragma solidity ^0.4.13;

import "./Crowdsale.sol";

contract HighVibeCrowdsale is Crowdsale {
    string public website;
    string public medium;
    string public telegram;

  function HighVibeCrowdsale() public {
    website = "https://www.highvibe.network";
    medium = "https://www.medium.com/highvibe-network/";
    telegram = "https://t.me/highvibenetworktoken";

    presaleDate = 1530932400;                       // July 7, 2018 @ midninght GMT +3 [Estonian time]
    saleDate = presaleDate + 32 days;    // 32 hours later
    endDate = saleDate + 32 days; // 32 days later: September 9th, 2018 @ midnight GMT +3

    state currentState = state.pendingStart;

    ethToTokenConversion = 26950;                 // 1 ETH == 26,950 HighVibe tokens

    maxTokenSupply = 1200000000 ether;           // 1,200,000,000
    companyTokens = 600000000 ether;             // 20% company reserve, 20% team + advisors, 10% contributors + authors

    uint maxCommunityWithoutBonusCap = 945000000 ether;
    uint maxCommunityCap = 1086750000 ether;           // 945,000,000 with 15% bonus of 141,750,000
    uint maxCrowdsaleCap = 788483829 ether;            // tokens allocated to crowdsale 

    maxContribution = 100 ether;                  // maximum contribution during community round
  }
}
