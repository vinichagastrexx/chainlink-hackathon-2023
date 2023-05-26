const { ethers } = require('hardhat');
const { config } = require('./config');

async function main() {
  const [owner] = await ethers.getSigners();
  const NFTRentMarketplace = await ethers.getContractFactory("NFTRentMarketplace");
  const marketplace = NFTRentMarketplace.attach(config.contractAddress);

  const categoryId = 1;
  await marketplace.connect(owner).createPool(categoryId);
  console.log(`Pool created with category ID: ${categoryId}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
