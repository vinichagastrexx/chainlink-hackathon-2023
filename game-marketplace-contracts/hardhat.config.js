'use strict';
require("@nomiclabs/hardhat-ethers");

module.exports = {
  defaultNetwork: "matic",
  networks: {
    hardhat: {
    },
    matic: {
      url: "https://nameless-evocative-cherry.matic-testnet.quiknode.pro/8ca90e11b3d4c5f4bd5e120be032badb236f026c/",
      accounts: ["9bcdcecec956d01178a1320ff0cbe362eb59f8fe711642703b7419966320df52"]
    }
  },
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};
