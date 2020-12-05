# aureus-blockchain

## Description

`a simple blockchain structure applied using a cryptocurrency named aureus.`

This is not finished yet. Still going to develop some express routes and a client-side demo.

## Usage

Future usage will be through browser. 😄

At the moment, if you want to know how it works, you can clone and test it.

Follow the index.js as a guide to implement some random tests, but here are some useful functions:

-

```
const transaction1 = new Transaction(walletAddress, 'address2', 10)
transaction1.signTransaction(key)
aureusCoin.addTransaction(transaction1)
```

this will add a transaction to the memory pool. you should generate a key first, follow index to check how to generate it.

`const aureusCoin = new Blockchain()`

`aureusCoin.minePendingTransactions(walletAddress)`

here you can mine your block! 🎉️

`console.log(`Wallet amount: ${aureusCoin.getBalanceOfAddress(walletAddress)}`)

check the balance of the wallet. this value is following the blockchain patterns, it means it isn't stored in any database, but generated everytime its requested.

`console.log(aureusCoin.isValidChain())` 👀️

this will check if the blockchain is valid, if you try to change data and generate new hashes it will return false, so don't even try it 😄

obs: difficulty is set to 2, only for test porpouse, and mining reward is set to 100 aureus.

## Contact

send me an email: rubenfsolorzano@hotmail.com

## License

ICS

see ya! 🚀️
