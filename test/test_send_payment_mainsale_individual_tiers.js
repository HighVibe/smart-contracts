var HighVibeCrowdsale = artifacts.require('../contracts/HighVibeCrowdsale');
var TestCrowdsale = artifacts.require('../contracts/TestCrowdsale')
var HighVibeToken = artifacts.require('../contracts/HighVibeToken');
const moment = require('moment');

contract('Check Transaction', function(accounts) {
	let hv;
	let testCrowd;

	// Check Accounts Address
	let account0 = web3.eth.accounts[0];
	let account1 = web3.eth.accounts[1];
	let account2 = web3.eth.accounts[2];

	beforeEach(async function() {
		testCrowd = await TestCrowdsale.deployed();
		hv = await HighVibeToken.deployed();
		console.log('testCrowdsale', testCrowd.address)
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


	it('Sending Payment to Crowdsale during Main-Sale Round Tier 4', async function() {
		// Create a HighVibeToken instance with the TestCrowdsale address
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
		let initial_eth = await testCrowd.ethRaisedWithoutCompany();
		console.log('initial balance: ', initial_balance);
		console.log('initial token: ', initial_token);
		console.log('initial eth in crowdsale: ', initial_eth);
		console.log('initial balance number: ', initial_balance_number);

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

		let total_eth_raised = await testCrowd.ethRaisedWithoutCompany();


		let contributor = account1.toString();
		let tokens_owed_to_contributor = await testCrowd.contributorList(contributor);
		let tokens_owed_to_contributor_number = new web3.BigNumber(tokens_owed_to_contributor[1]).toNumber();
		let interpreted_tokens = interpretNumber(tokens_owed_to_contributor_number)

		console.log("check balance of tokens owed to contributor, ", tokens_owed_to_contributor)
		console.log("check balance of tokens owed to contributor number, ", interpreted_tokens);
		console.log('test post_balance: ', big2Number(await web3.eth.getBalance(account1)));
		console.log('post balance: ', post_balance);
		console.log('total eth raised after first contribution: ', total_eth_raised);
		// console.log('post token number: ', post_token_number);
		console.log('post balance number: ', post_balance_number);
		// console.log('post eth number in crowdsale: ', post_ethRaised_number);

		assert.equal(interpreted_tokens, 1.1, 'check 25% bonus tier')
	});

	it('Sending Payment to Crowdsale during Main-Sale Round Tier 5', async function() {

		// Create a HighVibeToken instance with the HighVibeCrowdsale address
		// console.log('crowdsale address: ', crowdsale.address);
		let expected_address = await hv.crowdsaleContractAddress();
		assert.equal(expected_address, testCrowd.address, 'check Crowdsale contract address');


		// Set Token on TestCrowdsale
		await testCrowd.setToken(HighVibeToken.address);
		let tokenAddress = await testCrowd.getToken();
		assert.equal(HighVibeToken.address, tokenAddress, 'check set token');

		//send payment
		let value = web3.toWei(2, "ether"); // 1 eth
		
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

		let total_eth_raised = await testCrowd.ethRaisedWithoutCompany();


		let contributor = account1.toString();
		let tokens_owed_to_contributor = await testCrowd.contributorList(contributor);
		let tokens_owed_to_contributor_number = new web3.BigNumber(tokens_owed_to_contributor[1]).toNumber();
		let interpreted_tokens = interpretNumber(tokens_owed_to_contributor_number)

		console.log("check balance of tokens owed to contributor, ", tokens_owed_to_contributor)
		console.log("check balance of tokens owed to contributor number, ", interpreted_tokens);
		console.log('test post_balance: ', big2Number(await web3.eth.getBalance(account1)));
		console.log('post balance: ', post_balance);
		console.log('total eth raised after second contribution: ', total_eth_raised);
		console.log('post balance number: ', post_balance_number);

		assert.equal(interpreted_tokens, 3.25, 'check tokens in 20% bonus tier')
	});

	it('Sending Payment to Crowdsale during Main-Sale Round Tier 6', async function() {

		// Create a HighVibeToken instance with the TestCrowdsale address
		let expected_address = await hv.crowdsaleContractAddress();
		assert.equal(expected_address, testCrowd.address, 'check Crowdsale contract address');


		// Set Token on TestCrowdsale
		await testCrowd.setToken(HighVibeToken.address);
		let tokenAddress = await testCrowd.getToken();
		assert.equal(HighVibeToken.address, tokenAddress, 'check set token');

		//send payment
		let value = web3.toWei(3, "ether"); // 1 eth
		
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

		let total_eth_raised = await testCrowd.ethRaisedWithoutCompany();


		let contributor = account1.toString();
		let tokens_owed_to_contributor = await testCrowd.contributorList(contributor);
		let tokens_owed_to_contributor_number = new web3.BigNumber(tokens_owed_to_contributor[1]).toNumber();
		let interpreted_tokens = interpretNumber(tokens_owed_to_contributor_number)

		console.log("check balance of tokens owed to contributor, ", tokens_owed_to_contributor)
		console.log("check balance of tokens owed to contributor number, ", interpreted_tokens);
		console.log('test post_balance: ', big2Number(await web3.eth.getBalance(account1)));
		console.log('post balance: ', post_balance);
		console.log('total eth raised after second contribution: ', total_eth_raised);
		console.log('post balance number: ', post_balance_number);

		assert.equal(interpreted_tokens, 6.40, 'check tokens in % bonus tier')
	});

	it('Sending Payment to Crowdsale during Main-Sale Round Tier 7', async function() {

		// Create a HighVibeToken instance with the TestCrowdsale address
		let expected_address = await hv.crowdsaleContractAddress();
		assert.equal(expected_address, testCrowd.address, 'check Crowdsale contract address');


		// Set Token on TestCrowdsale
		await testCrowd.setToken(HighVibeToken.address);
		let tokenAddress = await testCrowd.getToken();
		assert.equal(HighVibeToken.address, tokenAddress, 'check set token');

		//send payment
		let value = web3.toWei(4, "ether"); // 1 eth
		
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

		let total_eth_raised = await testCrowd.ethRaisedWithoutCompany();


		let contributor = account1.toString();
		let tokens_owed_to_contributor = await testCrowd.contributorList(contributor);
		let tokens_owed_to_contributor_number = new web3.BigNumber(tokens_owed_to_contributor[1]).toNumber();
		let interpreted_tokens = interpretNumber(tokens_owed_to_contributor_number)

		console.log("check balance of tokens owed to contributor, ", tokens_owed_to_contributor)
		console.log("check balance of tokens owed to contributor number, ", interpreted_tokens);
		console.log('test post_balance: ', big2Number(await web3.eth.getBalance(account1)));
		console.log('post balance: ', post_balance);
		console.log('total eth raised after second contribution: ', total_eth_raised);
		console.log('post balance number: ', post_balance_number);

		assert.equal(interpreted_tokens, 10.4, 'check tokens in % bonus tier')
	});
})

function big2Number(bigNumber) {
	let web3Big = new web3.BigNumber(bigNumber);
	return web3Big.toString();
}

function interpretNumber(num) {
	return num / 10 ** 18
}