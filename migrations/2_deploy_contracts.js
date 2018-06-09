var HighVibeToken = artifacts.require("./HighVibeToken.sol");
var HighVibeCrowdsale = artifacts.require("./HighVibeCrowdsale.sol");
var TestCrowdsale = artifacts.require('../contracts/TestCrowdsale');

module.exports = function(deployer) {
  deployer.deploy(TestCrowdsale).then(function() {
    return deployer.deploy(HighVibeToken, TestCrowdsale.address);
  });
};
