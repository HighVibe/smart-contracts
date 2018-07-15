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
		assert.equal(expected_state, curr_state[1].c, 'Checking Pending Start State');
	});


	it('Sending Payment to Crowdsale during Tier 1', async function() {
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

		let ts = await testCrowd.tokenSold;
		

		console.log('address: ', testCrowd.address);
		let initial_hv = await hv.balanceOf(account1);
		// let initial_hv_number = new web3.BigNumber(initial_hv);
		console.log('token balance: ', initial_hv);
		// console.log('token balance number: ', initial_hv_number);
		console.log("amount of ether being sent: ", value);
		console.log('amount of tokens sold: ', ts)

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

		assert.equal(interpreted_tokens, 1.15, 'check 15% bonus tier')
	});

	it('Sending Payment to Crowdsale Tier 2', async function() {

		// Create a HighVibeToken instance with the HighVibeCrowdsale address
		// console.log('crowdsale address: ', crowdsale.address);
		let expected_address = await hv.crowdsaleContractAddress();
		assert.equal(expected_address, testCrowd.address, 'check Crowdsale contract address');


		// Set Token on TestCrowdsale
		await testCrowd.setToken(HighVibeToken.address);
		let tokenAddress = await testCrowd.getToken();
		assert.equal(HighVibeToken.address, tokenAddress, 'check set token');

		//send payment
		let value = web3.toWei(1, "ether"); // 1 eth
		
		console.log('address: ', testCrowd.address);
		let initial_hv = await hv.balanceOf(account1);
		// let initial_hv_number = new web3.BigNumber(initial_hv).toString();
		console.log('token balance: ', initial_hv);
		// console.log('token balance number: ', initial_hv_number);

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

		assert.equal(interpreted_tokens, 2.25, 'check tokens in 20% bonus tier')
	});

	it('Sending Payment to Crowdsale during Pre-Sale Round Tier 3', async function() {

		// Create a HighVibeToken instance with the TestCrowdsale address
		let expected_address = await hv.crowdsaleContractAddress();
		assert.equal(expected_address, testCrowd.address, 'check Crowdsale contract address');


		// Set Token on TestCrowdsale
		await testCrowd.setToken(HighVibeToken.address);
		let tokenAddress = await testCrowd.getToken();
		assert.equal(HighVibeToken.address, tokenAddress, 'check set token');

		//send payment
		let value = web3.toWei(1, "ether"); // 1 eth
		
		console.log('address: ', testCrowd.address);
		let initial_hv = await hv.balanceOf(account1);
		// let initial_hv_number = new web3.BigNumber(initial_hv).toString();
		console.log('token balance: ', initial_hv);
		// console.log('token balance number: ', initial_hv_number);

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

		assert.equal(interpreted_tokens, 3.3, 'check tokens in % bonus tier')
	});

	it('Sending Payment to Crowdsale Tier 4', async function() {

		// Create a HighVibeToken instance with the TestCrowdsale address
		let expected_address = await hv.crowdsaleContractAddress();
		assert.equal(expected_address, testCrowd.address, 'check Crowdsale contract address');


		// Set Token on TestCrowdsale
		await testCrowd.setToken(HighVibeToken.address);
		let tokenAddress = await testCrowd.getToken();
		assert.equal(HighVibeToken.address, tokenAddress, 'check set token');

		//send payment
		let value = web3.toWei(1, "ether"); // 1 eth
		
		console.log('address: ', testCrowd.address);
		let initial_hv = await hv.balanceOf(account1);
		// let initial_hv_number = new web3.BigNumber(initial_hv).toString();
		console.log('token balance: ', initial_hv);
		// console.log('token balance number: ', initial_hv_number);

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

		assert.equal(interpreted_tokens, 4.3, 'check tokens in % bonus tier')
	});

	it('Crowdsale state changes to closed after all tokens are sold', async function() {
		let expected_address = await hv.crowdsaleContractAddress();
		assert.equal(expected_address, testCrowd.address, 'check Crowdsale contract address');


		// Set Token on TestCrowdsale
		await testCrowd.setToken(HighVibeToken.address);
		let tokenAddress = await testCrowd.getToken();
		assert.equal(HighVibeToken.address, tokenAddress, 'check set token');



		let tokens_sold = await testCrowd.tokenSold;
		console.log('Total tokens sold: ', tokens_sold);

		let max_token_supply = await testCrowd.maxTokenSupply;
		console.log('Max supply: ', max_token_supply);

    await timeTravel(86400 * 3) //3 days later
    // await mineBlock() // workaround for https://github.com/ethereumjs/testrpc/issues/336
		// let status = await testCrowd.getState();
		
		console.log("Current time: ", web3.eth.getBlock(web3.eth.blockNumber).timestamp)


		let state_changer = await testCrowd.claimRemainingTokens();

		testCrowd = await TestCrowdsale.deployed();
		let curr_state = await testCrowd.getState();
		let expected_state = 3; // Pending Start
		assert.equal(expected_state, curr_state[1].c[0], 'Checking Pending Start State');
	});

	it('Account recieves tokens after crowdsale is complete', async function() {

		// Create a HighVibeToken instance with the HighVibeCrowdsale address
		// console.log('crowdsale address: ', crowdsale.address);
		let expected_address = await hv.crowdsaleContractAddress();
		assert.equal(expected_address, testCrowd.address, 'check Crowdsale contract address');


		// Set Token on TestCrowdsale
		await testCrowd.setToken(HighVibeToken.address);
		let tokenAddress = await testCrowd.getToken();
		assert.equal(HighVibeToken.address, tokenAddress, 'check set token');

		let check_unlock = await testCrowd.UnlockTokens();
		

	})
})

function big2Number(bigNumber) {
	let web3Big = new web3.BigNumber(bigNumber);
	return web3Big.toString();
}

function interpretNumber(num) {
	return num / 10 ** 18
}

const timeTravel = function (time) {
  return new Promise((resolve, reject) => {
    web3.currentProvider.sendAsync({
      jsonrpc: "2.0",
      method: "evm_increaseTime",
      params: [time], // 86400 is num seconds in day
      id: new Date().getTime()
    }, (err, result) => {
      if(err){ return reject(err) }
      return resolve(result)
    });
  })
}