var HighVibeCrowdsale = artifacts.require('../contracts/HighVibeCrowdsale');
var TestCrowdsale = artifacts.require('../contracts/TestCrowdsale')
var HighVibeToken = artifacts.require('../contracts/HighVibeToken');
const moment = require('moment');

contract('Check Transaction', function(accounts) {
	let crowdsale;
	let hv;
	let testCrowd;

	// Check Accounts Address
	let account0 = web3.eth.accounts[0];
	let account1 = web3.eth.accounts[1];
	let account2 = web3.eth.accounts[2];

	beforeEach(async function() {
		crowdsale = await HighVibeCrowdsale.deployed();
		testCrowd = await TestCrowdsale.deployed();
		hv = await HighVibeToken.deployed();
		console.log('testCrowdsale', testCrowd.address)
		console.log('crowdsale: ', crowdsale.address);
		console.log('HighVibeToken: ', hv.address);
	});	

	it('Setting HighVibeCrowdsale contract address to HighVibeToken contract', async function() {
		hv = await HighVibeToken.deployed();
		return HighVibeToken(testCrowd.address);
	});

	it('Setting company address to HighVibeCrowdsale', async function() {
		testCrowd = await TestCrowdsale.deployed();
		return testCrowd.setCompanyAddress(account0);
	});

	it('Check Initial Crowdsale State', async function() {
		testCrowd = await TestCrowdsale.deployed();
		let curr_state = await testCrowd.getState();
		let expected_state = 1; // Pending Start
		console.log(curr_state[2])
		assert.equal(expected_state, curr_state[2], 'Checking Pending Start State');
	});


	it('Sending Payment to Crowdsale during Pre-Sale Round', async function() {
		// Create a HighVibeToken instance with the HighVibeCrowdsale address
		// console.log('crowdsale address: ', crowdsale.address);
		let expected_address = await hv.crowdsaleContractAddress();
		assert.equal(expected_address, testCrowd.address, 'check Crowdsale contract address');


		// Set Token on TestCrowdsale
		await testCrowd.setToken(HighVibeToken.address);
		let tokenAddress = await testCrowd.getToken();
		assert.equal(HighVibeToken.address, tokenAddress, 'check set token');


		// Send Payment transaction
		// Check before and after balance of the account, tokenSold, ethRaised
		let initial_balance = await web3.eth.getBalance(account1);
		let initial_balance_number = new web3.BigNumber(initial_balance).toString();
		let initial_token = await testCrowd.getToken();
		// let initial_token_number = new web3.BigNumber(initial_token).toString();
		let initial_eth = await testCrowd.ethRaisedWithoutCompany();
		// let initial_eth_number = new web3.BigNumber(initial_eth).toString();
		console.log('initial balance: ', initial_balance);
		console.log('initial token: ', initial_token);
		console.log('initial eth in crowdsale: ', initial_eth);
		console.log('initial balance number: ', initial_balance_number);
		// console.log('initial token number: ', initial_token_number);
		// console.log('initial eth number in crowdsale: ', initial_eth_number);

		// let value = web3.toWei(1, 'wei');
		// let value_number = new web3.BigNumber(value).toString();
		// console.log('value: ', value);
		// console.log('value number: ', value_number);
		let value = web3.toWei(1, "ether"); // 1 eth
		

		console.log('address: ', testCrowd.address);
		let initial_hv = await hv.balanceOf(account1);
		let initial_hv_number = new web3.BigNumber(initial_hv).toString();
		console.log('token balance: ', initial_hv);
		console.log('token balance number: ', initial_hv_number);

		web3.eth.sendTransaction({
			from: account1,
			to: testCrowd.address,
			value: value,
			gas: 4500000 //4,500,000
		});

		let post_balance = await web3.eth.getBalance(account1);
		let post_balance_number = new web3.BigNumber(post_balance).toString();

		let post_token = await testCrowd.presaleTokenSold;
		// let post_token_number = new web3.BigNumber(post_token).toString();

		// let post_ethRaised = await testCrowd.ethRaisedWithoutCompany();
		// let post_ethRaised_number = new web3.BigNumber(post_ethRaised).toString();

		let contributor = account1.toString();
		let tokens_owed_to_contributor = testCrowd.contributorList[contributor];

		console.log("check balance of tokens owed to contributor, ", tokens_owed_to_contributor)
		console.log('test post_balance: ', big2Number(await web3.eth.getBalance(account1)));
		console.log('post balance: ', post_balance);
		console.log('post token: ', post_token);
		// console.log('post token number: ', post_token_number);
		console.log('post balance number: ', post_balance_number);
		// console.log('post eth number in crowdsale: ', post_ethRaised_number);


	});
});

function big2Number(bigNumber) {
	let web3Big = new web3.BigNumber(bigNumber);
	return web3Big.toString();
}