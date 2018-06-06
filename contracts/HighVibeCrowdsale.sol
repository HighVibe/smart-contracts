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

    communityRoundStartDate = 1510063200;                       // Nov 7, 2017 @ 6am PST
    crowdsaleStartDate = communityRoundStartDate + 24 hours;    // 24 hours later
    crowdsaleEndDate = communityRoundStartDate + 30 days + 12 hours; // 30 days + 12 hours later: Dec 7th, 2017 @ 6pm PST [1512698400]

    crowdsaleState = state.pendingStart;

    ethToTokenConversion = 26950;                 // 1 ETH == 26,950 HighVibe tokens

    maxTokenSupply = 1200000000 ether;           // 1,200,000,000
    companyTokens = 600000000 ether;             // 20% company reserve, 20% team + advisors, 10% contributors + authors

    maxCommunityWithoutBonusCap = 945000000 ether;
    maxCommunityCap = 1086750000 ether;           // 945,000,000 with 15% bonus of 141,750,000
    maxCrowdsaleCap = 788483829 ether;            // tokens allocated to crowdsale 

    maxContribution = 100 ether;                  // maximum contribution during community round
  }
}
