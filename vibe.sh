#!/bin/bash

clear
echo
echo
echo compiled smart contracts
echo

{
rm -R bin

solc --optimize --abi -o bin --overwrite contracts/HighVibeToken.sol 
solc --optimize --bin -o bin --overwrite contracts/HighVibeToken.sol

solc --optimize --abi -o bin --overwrite contracts/HighVibeCrowdsale.sol
solc --optimize --bin -o bin --overwrite contracts/HighVibeCrowdsale.sol

solc --optimize --abi -o bin --overwrite contracts/TestCrowdsale.sol
solc --optimize --bin -o bin --overwrite contracts/TestCrowdsale.sol
} &> /dev/null

ls -l bin/HighVibe*
ls -l bin/Test*

echo
