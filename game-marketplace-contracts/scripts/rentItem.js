const { ethers } = require('hardhat');

async function main() {
  const [owner] = await ethers.getSigners();
  const contractAddress = "0xe27B54065aE50e2447F151eD822357828a996ed8";
  const NFTRentMarketplace = await ethers.getContractFactory("NFTRentMarketplace");
  const marketplace = NFTRentMarketplace.attach(contractAddress);


  const itemId = 6;
  const categoryId = 1;
  await marketplace.connect(owner).rentItem(categoryId);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
