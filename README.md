# Replit Solidity Template
Welcome to the world of Ethereum and Web3! This is a beta template for Solidity development on Replit. Solidity is the language used to create Smart Contracts, which are programs that run on the Ethereum Blockchain.

Features include:
- Hot reloading
- Solidity error checking
- Deploying multiple contracts
- UI for testing out contracts
- Replit testnet + faucet

## Getting started
**Just press the `Run ▶️` button!**

- You should only need to do this once (and might take like 15s). This will install all relevant packages, start up the contract deployment UI, and compile your `contract.sol` file.

- `contract.sol` will automatically recompile whenever you edit it, and all your contracts inside of this file will be available to deploy from the UI.

- Pressing `cmd-s` or `ctrl-s` (windows) will reload the UI.

We have preinstalled packages from `@openzeppelin/contracts`. To install other solidity packages that are distributed on npm, make sure you install them using the Package Installer 📦 in the sidebar

## Examples

We included a few example contracts in the `examples` folder. These will not be automatically deployed or accessible in the UI, but you can copy / paste them into your main `contract.sol` file or import them. They're there for your reference!

## Future work

We're working on some other features for making development here a lot easier, which are included, but not limited to:

- LSP support for solidity
- Integration with hardhat for "local" (in-repl) testing
- An actual solidity REPL for quickly prototyping / testing functions or lines.

## Feedback

Please leave any comments on this repl's [spotlight page here](https://replit.com/@replit/Solidity-starter-beta?v=1).

The UI is subject to change (and still needs some real responsive work), so we'd appreciate any feedback there. 

We're also trying to improve the overall dev experience, especially for beginners, so any feedback there is appreciated. 

hello world!

another change
please work now...
didn't work that time...

ok trying one more time and then I'm taking a break


## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```
/
├── contracts/
│   ├── examples/
│   │   ├── NFT.sol
│   │   ├── token.sol
│   │   └── wallet.sol
│   ├── contract.sol
│   ├── Game.sol
│   ├── GHO.sol
│   ├── RaiseTheStakes.sol
│   └── RaiseTheStakesTester.sol
├── scripts/
│   ├── borrowgho.js
│   └── test.js
├── tools /
│   ├── index.js
│   ├── ui.jsx
│   └── README.md
├── sniff.cjs
├── upgrade-vite.cjs
├── vite.config.js
├── package.json
└── README.md
```
