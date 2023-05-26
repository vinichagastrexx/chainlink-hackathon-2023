const { ethers } = require('hardhat');
const { config } = require('./config');

async function main() {
  const [owner] = await ethers.getSigners();
  const NFTRentMarketplace = await ethers.getContractFactory("NFTRentMarketplace");
  const marketplace = NFTRentMarketplace.attach(config.contractAddress);
  await marketplace.connect(owner).addItemToPool(config.item, config.categoryId);
  console.log(`Item with ID: ${config.item} added to pool with category ID: ${config.categoryId}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
