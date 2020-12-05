const SHA256 = require('crypto-js/sha256')
const EC = require('elliptic').ec
const ec = new EC('secp256k1')

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress
    this.toAddress = toAddress
    this.amount = amount
  }

  generateTxHash = () => {
    return SHA256(this.fromAddress + this.toAddress + this.amount).toString()
  }

  signTransaction = key => {
    if (key.getPublic('hex') !== this.fromAddress) {
      throw new Error('You cannot sign transactions for other wallets')
    }

    const hashTx = this.generateTxHash()
    const signature = key.sign(hashTx, 'base64')
    this.signature = signature.toDER('hex')
  }

  isValid = () => {
    if (this.fromAddress === null) return true

    if (!this.signature || this.signature.length === 0)
      throw new Error('No signature in this transaction')

    const publicKey = ec.keyFromPublic(this.fromAddress, 'hex')
    return publicKey.verify(this.generateTxHash(), this.signature)
  }
}

////////////////////// BLOCK //////////////////

class Block {
  constructor(transactions, previousHash) {
    this.timestamp = Date.now()
    this.transactions = transactions
    this.previousHash = previousHash
    this.hash = this.generateHash()
    this.nonce = 0
  }

  generateHash = () => {
    return SHA256(
      this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce
    ).toString()
  }

  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')
    ) {
      this.nonce++
      this.hash = this.generateHash()
    }
    console.log(`Block mined: ${this.hash}`)
  }

  hasValidTransactions = () => {
    for (const transaction of this.transactions) {
      if (!transaction.isValid()) return false
    }
    return true
  }
}

///////////// BLOCKCHAIN //////////////////

class Blockchain {
  constructor() {
    this.chain = [this.generateGenesisBlock()]
    this.difficulty = 2
    this.pendingTransactions = []
    this.miningReward = 100
  }

  generateGenesisBlock = () => {
    return new Block('Genesis Block', '0000')
  }

  getLatestBlock = () => {
    return this.chain[this.chain.length - 1]
  }

  minePendingTransactions = miningRewardAddress => {
    if (this.pendingTransactions.length === 0)
      throw new Error('There are no pending transactions.')
    const rewardTx = new Transaction(
      null,
      miningRewardAddress,
      this.miningReward
    )
    this.pendingTransactions.push(rewardTx)

    const block = new Block(
      this.pendingTransactions,
      this.getLatestBlock().hash
    )
    block.mineBlock(this.difficulty)

    console.log('Block successfully mined!')
    this.chain.push(block)

    this.pendingTransactions = []
  }

  addTransaction = transaction => {
    if (
      !transaction.fromAddress ||
      !transaction.toAddress ||
      !transaction.amount
    )
      throw new Error('fromAddress, toAddress and amount are mandatory.')

    if (!transaction.isValid()) throw new Error('Invalid transaction.')

    this.pendingTransactions.push(transaction)
  }

  getBalanceOfAddress = address => {
    let balance = 0
    for (const block of this.chain) {
      for (const transaction of block.transactions) {
        if (transaction.fromAddress === address) balance -= transaction.amount
        if (transaction.toAddress === address) balance += transaction.amount
      }
    }
    return balance
  }

  isValidChain = () => {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i]
      const previousBlock = this.chain[i - 1]

      if (!currentBlock.hasValidTransactions()) return false
      if (currentBlock.hash !== currentBlock.generateHash()) return false
      if (currentBlock.previousHash !== previousBlock.hash) return false
    }
    return true
  }
}

module.exports.Blockchain = Blockchain
module.exports.Block = Block
module.exports.Transaction = Transaction
