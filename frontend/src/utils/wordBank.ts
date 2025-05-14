// src/utils/wordBank.ts

export interface WordHintPair {
    word: string;
    hint: string;
  }
  
  export const wordBank: WordHintPair[] = [
    { word: "blockchain", hint: "Technology behind Bitcoin" },
    { word: "wallet", hint: "Used to store cryptocurrency" },
    { word: "nft", hint: "Digital asset stored on a blockchain" },
    { word: "solidity", hint: "Smart contract programming language" },
    { word: "ether", hint: "Ethereum's native currency" },
    { word: "gas", hint: "Fee required to perform a transaction" },
    { word: "token", hint: "Unit of value on a blockchain" },
    { word: "web3", hint: "Next generation of the internet" },
    { word: "hash", hint: "Unique output from a hash function" },
    { word: "miner", hint: "Verifies transactions on the blockchain" },
  ];