const { ethers } = require('hardhat');

async function main() {
  const GameMarketplace = await ethers.getContractFactory("GameMarketplace");
  const gameMarketplace = await GameMarketplace.deploy();
  await gameMarketplace.deployed();

  console.log("GameMarketplace deployed to:", gameMarketplace.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
