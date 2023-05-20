// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
//import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract GameMarketplace is Ownable {
    using Counters for Counters.Counter;

    struct Item {
        address owner;
        uint256 poolId;
        uint256 categoryId;
        address rentedBy;
    }

    struct Pool {
        uint256 id;
        uint256 categoryId;
        bool isActive;
        Item[] availableItems;
        Item[] rentedItems;
    }

    Counters.Counter private _poolIds;

    mapping(uint256 => Pool) private pools;
    mapping(uint256 => Item) private items;

    event PoolDisabled(uint256 poolId);
    event PoolCreated(uint256 poolId, uint256 categoryId);
    event ItemAddedToPool(uint256 itemId, uint256 poolId);

    address public erc721Address;

    bytes32 internal keyHash;
    uint256 internal fee;

//    constructor(address _VRFCoordinator, address _LinkToken, bytes32 _keyHash, uint256 _fee)
//    ERC721("GameMarketplace", "GMKT")
//    VRFConsumerBase(_VRFCoordinator, _LinkToken)
//    {
//        keyHash = _keyHash;
//        fee = _fee;
//    }

    /**
     * @dev Create a new Pool.
     * @param _categoryId  The name of the category
     */
    function createPool(uint256 _categoryId) public onlyOwner {
        require(pools[_categoryId].categoryId == 0, "Pool with this category ID already exists");

        _poolIds.increment();
        uint256 newPoolId = _poolIds.current();

        Pool storage newPool = pools[_categoryId];
        newPool.id = newPoolId;
        newPool.categoryId = _categoryId;
        newPool.isActive = true;

        emit PoolCreated(newPoolId, _categoryId);
    }

    function disablePool(uint256 _categoryId) public onlyOwner {
        require(pools[_categoryId].isActive, "Pool already inactive");
        pools[_categoryId].isActive = false;
        emit PoolDisabled(_categoryId);
    }

    /**
    * @dev Create a new item.
     * @param _itemId The ID of the item
     * @param _categoryId The ID of the category
     */
    function createItem(uint256 _itemId, uint256 _categoryId) public {
        require(items[_itemId].owner == address(0), "Item already exists");

        // Cria um novo Item e adiciona ao mapeamento de items
        items[_itemId] = Item({
            owner: msg.sender,
            poolId: 0, // Inicialmente o item não está em uma pool
            categoryId: _categoryId,
            rentedBy: address(0)
        });
    }

    /**
     * @dev Get an item.
     * @param _itemId The ID of the item
     */
    function getItem(uint256 _itemId) public view returns (Item memory) {
        return items[_itemId];
    }

    /**
     * @dev Get a pool by ID.
     * @param _categoryId The ID of the category
     */
    function getPool(uint256 _categoryId) public view returns (uint256 id, uint256 categoryId, bool isActive, Item[] memory availableItems, Item[] memory rentedItems) {
        Pool storage pool = pools[_categoryId];
        return (pool.id, pool.categoryId, pool.isActive, pool.availableItems, pool.rentedItems);
    }


    /**
    * @dev Add item to a pool.
     * @param _itemId The ID of the item
     * @param _categoryId The ID of the category
     */
    function addItemToPool(uint256 _itemId, uint256 _categoryId) public virtual {
        Pool storage pool = pools[_categoryId];
        require(pool.isActive, "Pool with the given category ID does not exist or is not active");

        Item memory item = getItem(_itemId);
        require(item.owner == msg.sender, "Only item owner can add it to a pool");

        // Transfere o NFT para este contrato para gestão
//        ERC721 erc721 = ERC721(erc721Address);
//        erc721.transferFrom(msg.sender, address(this), _itemId);

        // Adiciona o item à pool
        pools[_categoryId].availableItems.push(item);

        // Atualiza o ID da pool do item no mapeamento
        items[_itemId].poolId = _categoryId;

        // Emite um evento para notificar que o item foi adicionado
        emit ItemAddedToPool(_itemId, _categoryId);
    }


//    /**
//     * @dev Rent an item from a category pool.
//     * @param _categoryId The ID of the category
//     */
//    function rentItemFromPool(uint256 _categoryId) public payable virtual {
//        // Implement function to rent an item from a category pool
//    }
//
//    /**
//     * @dev End the rental period for an item.
//     * @param _itemId The ID of the item
//     */
//    function endRental(uint256 _itemId) public virtual {
//        // Implement function to end the rental period for an item
//    }
//
//    /**
//     * @dev Withdraw rental fees for an item.
//     * @param _itemId The ID of the item
//     */
//    function withdrawRentFees(uint256 _itemId) public virtual {
//        // Implement function to withdraw rental fees for an item
//    }
//
//    /**
//     * @dev Request randomness for item selection in a category pool.
//     * @param _categoryId The ID of the category
//     */
//    function requestRandomItem(uint256 _categoryId) internal virtual {
//        // Implement function to request randomness for item selection in a category pool
//    }
//
//    /**
//     * @dev Fulfill randomness for item selection in a category pool.
//     * @param _randomness The random number returned by the Chainlink VRF
//     */
//    function fulfillRandomness(uint256 _randomness) internal override {
//        // Implement function to fulfill randomness for item selection in a category pool
//    }
//
//    function setRentalFee(string memory _category) public {
//        // A Chainlink Functions URL seria algo como:
////        // https://usechainlinkfunctions.com/{your-chainlink-function-id}
////        // Substitua {your-chainlink-function-id} pelo ID da sua função Chainlink.
////        string memory chainlinkFunctionURL = "https://usechainlinkfunctions.com/{your-chainlink-function-id}";
////
////        // Crie a URL da função Lambda, adicionando a categoria à URL base.
////        string memory lambdaFunctionURL = string(abi.encodePacked(chainlinkFunctionURL, "?category=", _category));
////
////        // Use Chainlink Functions para chamar a função Lambda.
////        (bool success, bytes memory returnData) = chainlinkFunctionURL.get(lambdaFunctionURL);
////
////        require(success, "Failed to get the rental fee from the Lambda function.");
////
////        // Transformar os dados retornados em uint para usar como taxa de aluguel.
////        uint rentalFee = abi.decode(returnData, (uint));
////
////        // Armazenar a taxa de aluguel para a categoria.
////        rentalFees[_category] = rentalFee;
//    }

}
