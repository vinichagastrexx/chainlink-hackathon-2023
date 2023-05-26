// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC721Base.sol";

contract GameNFT is ERC721Base {
    address private NFTRentMarketplace;

    constructor(
        string memory _name,
        string memory _symbol,
        address _royaltyRecipient,
        uint128 _royaltyBps
    ) ERC721Base(_name, _symbol, _royaltyRecipient, _royaltyBps) {}

    function setNFTRentMarketplace(
        address _NFTRentMarketplace
    ) public onlyOwner {
        NFTRentMarketplace = _NFTRentMarketplace;
    }

    function mintTo(address _to, string memory _tokenURI) public override {
        require(super._canMint(), "Not authorized to mint.");
        uint256 newTokenId = nextTokenIdToMint();
        super._setTokenURI(newTokenId, _tokenURI);
        super._safeMint(_to, 1, "");
        super.approve(NFTRentMarketplace, newTokenId);
    }
}
