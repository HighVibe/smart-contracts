pragma solidity ^0.4.19;

import "./Utils/ReentrancyHandling.sol";
import "./Utils/Owned.sol";
import "./Utils/SafeMath.sol";
import "./Interfaces/IToken.sol";
import "./Interfaces/IERC20Token.sol";

contract Crowdsale is ReentrancyHandling, Owned {

  using SafeMath for uint256;
  
  struct ContributorData {
    uint256 contributionAmount;
    uint256 tokensIssued;
  }

  mapping(address => ContributorData) public contributorList;

  struct LockData {
    uint256 tokens;
    uint period;
  }

  mapping(address => LockData) public lockedTokensList;

  enum state { pendingStart, saleStart, saleEnd }
  state saleState;

  uint public saleDate;
  uint public endDate;

  event SaleStarted(uint timestamp);
  event SaleEnded(uint timestamp);

  IToken token = IToken(0x0);
  uint ethToTokenConversion;

  uint256 maxSaleWithoutBonusCap;
  uint256 tier1;
  uint256 tier2;
  uint256 tier3;
  uint256 tier4;


  uint256 tokenSold = 0;
  uint256 tokensWithoutBonusSold = 0;
  uint256 public ethRaisedWithoutCompany = 0;

  address companyAddress;   // company wallet address in cold/hardware storage 

  uint maxTokenSupply;
  uint companyTokens;
  bool treasuryLocked = false;
  bool ownerHasClaimedTokens = false;
  bool ownerHasClaimedCompanyTokens = false;


  // limit gas price to 50 Gwei (about 5-10x the normal amount)
  modifier onlyLowGasPrice {
	  require(tx.gasprice <= 50*10**9 wei);
	  _;
  }

  //
  // Unnamed function that runs when eth is sent to the contract
  //
  function() public noReentrancy onlyLowGasPrice payable {
    require(msg.value != 0);                                    // Throw if value is 0
    require(companyAddress != 0x0);
    require(token != IToken(0x0));

    checkSaleState();                                           // Calibrate sale state

    assert(saleState == state.saleStart);
    
    processTransaction(msg.sender, msg.value);                  // Process transaction and issue tokens

    checkSaleState();                                           // Calibrate sale state
  }

  // 
  // return state of smart contract
  //
  function getState() public constant returns (uint256, uint) {
    uint currentState = 0;

    if (saleState == state.pendingStart) {
      currentState = 1;
    }
    else if (saleState == state.saleStart) {
      currentState = 2;
    }
    else if (saleState == state.saleEnd) {
      currentState = 3;
    }

    return (tokenSold, currentState);
  }

  //
  // Check sale state and calibrate it
  //
  function checkSaleState() internal {
    if (now > endDate || tokenSold >= maxTokenSupply) {  // end sale once all tokens are sold or run out of time
      if (saleState != state.saleEnd) {
        saleState = state.saleEnd;
        emit SaleEnded(now);
      }
    }
    else if (now > saleDate) { // move into public sale 
      if (saleState != state.saleStart) {
        saleState = state.saleStart;  // change state
        emit SaleStarted(now);
      }
    }
  }

  //
  // Issue tokens and return if there is overflow
  //
  function calculateSale(uint256 _newContribution) internal returns (uint256, uint256) {
    uint256 saleEthAmount = _newContribution;

    // compute sale tokens without bonus
    uint256 saleTokenAmount = saleEthAmount.mul(ethToTokenConversion);

    // determine main sale tokens remaining
    uint256 availableTokenAmount = maxSaleWithoutBonusCap.sub(tokenSold);

    // verify sale tokens do not go over the max cap
    if (saleTokenAmount > availableTokenAmount) {
      // cap the tokens to the max allowed 
      saleTokenAmount = availableTokenAmount;

      // recalculate the corresponding ETH amount
      saleEthAmount = saleTokenAmount.div(ethToTokenConversion);
    }

    // track tokens sold during main sale round
    tokensWithoutBonusSold = tokensWithoutBonusSold.add(saleTokenAmount);

    // compute bonus tokens
    uint256 bonusTokenAmount = 0;

    // tier 4
    if (tokensWithoutBonusSold > tier3 + tier2 + tier1) {
      bonusTokenAmount = 0;
    }
    // tier 3
    else if (tokensWithoutBonusSold > tier2 + tier1) {
      bonusTokenAmount = saleTokenAmount.mul(5);
      bonusTokenAmount = bonusTokenAmount.div(100);
    }
    // tier 2
    else if (tokensWithoutBonusSold > tier1) {
      bonusTokenAmount = saleTokenAmount.mul(10);
      bonusTokenAmount = bonusTokenAmount.div(100);
    }
    // tier 1
    else {
      bonusTokenAmount = saleTokenAmount.mul(15);
      bonusTokenAmount = bonusTokenAmount.div(100);
    }

    // add bonus to presale tokens
    saleTokenAmount = saleTokenAmount.add(bonusTokenAmount);

    return (saleTokenAmount, saleEthAmount);
  }

  //
  // Issue tokens and return if there is overflow
  //
  function processTransaction(address _contributor, uint256 _amount) internal {
    uint256 tokenAmount = 0;
    uint256 saleEthAmount = 0;

    (tokenAmount, saleEthAmount) = calculateSale(_amount);

    assert(tokenAmount > 0);

    // Issue new tokens
    token.mintTokens(_contributor, tokenAmount);                              

    // log token issuance
    contributorList[_contributor].tokensIssued = contributorList[_contributor].tokensIssued.add(tokenAmount);                

    // Add contribution amount to existing contributor
    contributorList[_contributor].contributionAmount = contributorList[_contributor].contributionAmount.add(saleEthAmount);

    ethRaisedWithoutCompany = ethRaisedWithoutCompany.add(saleEthAmount); // Add contribution amount to ETH raised
    tokenSold = tokenSold.add(tokenAmount);         // track how many tokens are sold

    // compute any refund if applicable
    uint256 refundAmount = _amount.sub(saleEthAmount);

    if (refundAmount > 0) {
      _contributor.transfer(refundAmount);          // refund contributor amount behind the maximum ETH cap
    }

    companyAddress.transfer(saleEthAmount);       // send ETH to company
  }

  //
  // Method is needed for recovering tokens accidentally sent to token address
  //
  function salvageTokensFromContract(address _tokenAddress, address _to, uint _amount) public onlyOwner {
    IERC20Token(_tokenAddress).transfer(_to, _amount);
  }

  //
  // Owner can set company address
  //
  function setCompanyAddress(address _newAddress) public onlyOwner {
    require(!treasuryLocked);                              // Check if owner has already claimed tokens
    companyAddress = _newAddress;
    treasuryLocked = true;
  }

  //
  // Owner can set token address where mints will happen
  //
  function setToken(address _newAddress) public onlyOwner {
    token = IToken(_newAddress);
  }

  function getToken() public constant returns (address) {
    return address(token);
  }

  //
  // Claims company tokens
  //
  function claimCompanyTokens() public onlyOwner {
    require(!ownerHasClaimedCompanyTokens);                     // Check if owner has already claimed tokens
    require(companyAddress != 0x0);
    
    tokenSold = tokenSold.add(companyTokens); 
    token.mintTokens(companyAddress, companyTokens);            // Issue company tokens 
    ownerHasClaimedCompanyTokens = true;                        // Block further mints from this method
  }

  //
  // Claim remaining tokens when sale ends
  //
  function claimRemainingTokens() public onlyOwner {
    checkSaleState();                                             // Calibrate sale state
    require(saleState == state.saleEnd);                          // Check sale has ended
    require(!ownerHasClaimedTokens);                              // Check if owner has already claimed tokens
    require(companyAddress != 0x0);

    uint256 remainingTokens = maxTokenSupply.sub(token.totalSupply());
    token.mintTokens(companyAddress, remainingTokens);            // Issue tokens to company
    ownerHasClaimedTokens = true;                                 // Block further mints from this method
  }

  function LockTokens(address _contributor, uint256 _tokenAmount, uint _timeInterval) public onlyOwner {
    require(_contributor != 0x0);
    require(_tokenAmount > 0);

    lockedTokensList[_contributor] = LockData(_tokenAmount, now + _timeInterval);
  }

  function UnlockTokens() noReentrancy public {
    require(lockedTokensList[msg.sender].tokens > 0);

    // ensure lock-up period has expired before unlocking tokens
    require(now >= lockedTokensList[msg.sender].period);

    uint256 tokens = lockedTokensList[msg.sender].tokens;
    lockedTokensList[msg.sender].tokens = 0;
    delete lockedTokensList[msg.sender];

    // Issue tokens
    token.mintTokens(msg.sender, tokens);
  }
}
