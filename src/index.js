const { Blockchain, Transaction } = require('./blockchain')
const EC = require('elliptic').ec
const ec = new EC('secp256k1')

// creating wallet key
const key = ec.keyFromPrivate(
  '6562530d6f86a5f9e54ff520e5f4ba69d4705a4b380bb1ff2802fe3f3775f028'
)

const walletAddress = key.getPublic('hex')

// creating blockchain
const aureusCoin = new Blockchain()

// signing and adding new transaction
const transaction1 = new Transaction(walletAddress, 'address2', 10)
transaction1.signTransaction(key)
aureusCoin.addTransaction(transaction1)

// mining block
aureusCoin.minePendingTransactions(walletAddress)

// checking wallet balance
console.log(`Wallet amount: ${aureusCoin.getBalanceOfAddress(walletAddress)}`)

// checking if chain is valid
console.log(aureusCoin.isValidChain())
