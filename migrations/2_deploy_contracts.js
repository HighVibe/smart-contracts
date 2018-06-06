var HighVibeToken = artifacts.require("./HighVibeToken.sol");
var HighVibeCrowdsale = artifacts.require("./HighVibeCrowdsale.sol");

module.exports = function(deployer) {
  deployer.deploy(HighVibeCrowdsale).then(function() {
    return deployer.deploy(HighVibeToken, HighVibeCrowdsale.address);
  });
};
