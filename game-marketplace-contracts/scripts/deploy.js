const { ethers } = require('hardhat');

async function main() {
  const GameMarketplace = await ethers.getContractFactory("NFTRentMarketplace");
  const gameMarketplace = await GameMarketplace.deploy(
    4792,
    "0x6E32166b4299A94Ef7a656E1B84563C7b25a0279",
    "0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed"
  );
  await gameMarketplace.deployed();

  console.log("GameMarketplace deployed to:", gameMarketplace.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
