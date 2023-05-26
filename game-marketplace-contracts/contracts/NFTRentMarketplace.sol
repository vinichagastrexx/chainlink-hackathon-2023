// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract NFTRentMarketplace is
    VRFConsumerBaseV2,
    ConfirmedOwner,
    IERC721Receiver
{
    using Counters for Counters.Counter;
    VRFCoordinatorV2Interface public COORDINATOR;
    uint64 private s_subscriptionId;
    bytes32 private keyHash =
        0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f;
    uint32 private callbackGasLimit = 100000;
    uint16 private requestConfirmations = 3;
    uint32 private numWords = 1;
    Counters.Counter private _itemIds;

    struct Item {
        uint256 id;
        uint256 nftId;
        bool isRented;
        uint256 categoryId;
        address payable owner;
        address rentee;
        bool isInPool;
    }

    struct Pool {
        uint256 categoryId;
        bool isActive;
        uint256[] availableItems;
        uint256[] rentedItems;
    }

    struct Rent {
        uint256 requestId;
        uint256 initDate;
        uint256 expirationDate;
        uint256 finishDate;
        uint256 price;
        address owner;
        address rentee;
        uint256 poolId;
        uint256 randomNumber;
        uint256 itemId;
        RentStatus status;
    }

    enum RentStatus {
        REQUESTED,
        REQUEST_FULFILLED,
        ACTIVE,
        FINISHED
    }

    //Mappings
    mapping(uint256 => Pool) private pools;
    mapping(uint256 => Item) private items;
    mapping(uint256 => Rent) public rents;
    mapping(uint256 => uint256) private nftIdToItemId;

    //Rent Events
    event RentRequested(
        uint256 indexed requestId,
        address requester,
        uint256 poolId
    );
    event RentStarted(
        uint256 indexed requestId,
        uint256 poolId,
        address rentee,
        uint256 itemId
    );
    event RentFinished(
        uint256 indexed requestId,
        uint256 poolId,
        address rentee,
        uint256 itemId
    );
    event RentRequestFulfilled(uint256 indexed requestId, uint256 randomNumber);

    //Pool Events
    event PoolEnabled(uint256 poolId);
    event PoolDisabled(uint256 poolId);
    event PoolCreated(uint256 indexed poolId);

    //Item Events
    event ItemAddedToPool(uint256 indexed itemId, uint256 poolId);
    event ItemRemovedFromPool(uint256 indexed itemId, uint256 poolId);
    event ItemCreated(
        uint256 indexed itemId,
        uint256 indexed nftId,
        uint256 categoryId,
        address owner
    );
    address public nftContractAddress;

    constructor(
        uint64 subscriptionId,
        address _nftContractAddress,
        address _VRFCoordinator
    ) VRFConsumerBaseV2(_VRFCoordinator) ConfirmedOwner(msg.sender) {
        COORDINATOR = VRFCoordinatorV2Interface(_VRFCoordinator);
        s_subscriptionId = subscriptionId;
        nftContractAddress = _nftContractAddress;
    }

    modifier onlyNftOwner(uint256 _itemNftId) {
        uint256 itemId = nftIdToItemId[_itemNftId];
        Item storage item = items[itemId];
        require(
            msg.sender == item.owner,
            "Only the NFT owner can perform this operation"
        );
        _;
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        require(
            rents[_requestId].status == RentStatus.REQUESTED,
            "Request not found or already fulfilled"
        );
        rents[_requestId].randomNumber = _randomWords[0];
        rents[_requestId].status = RentStatus.REQUEST_FULFILLED;
        emit RentRequestFulfilled(_requestId, _randomWords[0]);
    }

    function createPool(uint256 _categoryId) public onlyOwner {
        require(_categoryId > 0, "category ID must be greater than 0");
        require(
            pools[_categoryId].categoryId == 0,
            "Pool with this category ID already exists"
        );

        Pool storage newPool = pools[_categoryId];
        newPool.categoryId = _categoryId;
        newPool.isActive = true;

        emit PoolCreated(_categoryId);
    }

    function disablePool(uint256 _categoryId) public onlyOwner {
        require(pools[_categoryId].isActive, "Pool already inactive");
        pools[_categoryId].isActive = false;
        emit PoolDisabled(_categoryId);
    }

    function enablePool(uint256 _categoryId) public onlyOwner {
        require(pools[_categoryId].isActive == false, "Pool already inactive");
        pools[_categoryId].isActive = true;
        emit PoolEnabled(_categoryId);
    }

    function createItem(uint256 _nftId, uint256 _categoryId) public {
        _itemIds.increment();
        uint256 newItemId = _itemIds.current();

        items[newItemId] = Item({
            id: newItemId,
            nftId: _nftId,
            owner: payable(msg.sender),
            categoryId: _categoryId,
            rentee: address(0),
            isRented: false,
            isInPool: false
        });
        nftIdToItemId[_nftId] = newItemId;
        emit ItemCreated(newItemId, _nftId, _categoryId, msg.sender);
    }

    function getRent(uint256 requestId) public view returns (Rent memory) {
        return rents[requestId];
    }

    function getItem(uint256 itemId) public view returns (Item memory) {
        return items[itemId];
    }

    function getPool(uint256 categoryId) public view returns (Pool memory) {
        return pools[categoryId];
    }

    function getItemByNftId(uint256 _nftId) public view returns (Item memory) {
        uint256 itemId = nftIdToItemId[_nftId];
        require(itemId != 0, "Item with the given NFT ID does not exist");
        return items[itemId];
    }

    function addItemToPool(uint256 _nftId, uint256 _categoryId) public {
        Pool storage pool = pools[_categoryId];
        uint256 itemId = nftIdToItemId[_nftId];
        Item storage item = items[itemId];

        require(item.id != 0, "Item does not exist");
        require(
            pool.isActive,
            "Pool with the given category ID does not exist or is not active"
        );
        require(items[item.id].isInPool == false, "Item is already in a pool");

        require(
            item.owner == msg.sender,
            "Only item owner can add it to a pool"
        );

        ERC721 erc721 = ERC721(nftContractAddress);
        erc721.safeTransferFrom(msg.sender, address(this), item.nftId);
        pools[_categoryId].availableItems.push(item.id);
        item.isInPool = true;
        emit ItemAddedToPool(item.id, _categoryId);
    }

    function removeItemFromPool(uint256 _nftId) public onlyNftOwner(_nftId) {
        uint256 itemId = nftIdToItemId[_nftId];
        Item storage item = items[itemId];
        uint256 poolId = item.categoryId;
        Pool storage pool = pools[poolId];

        require(item.id != 0, "Item does not exist");
        require(
            item.isRented == false,
            "Item is rented and cannot be removed from pool"
        );
        require(item.isInPool == true, "Item is not in Pool");

        uint256 availableIndex = findIndex(pool.availableItems, item.id);
        require(
            availableIndex < pool.availableItems.length,
            "Item not found in available items"
        );
        pool.availableItems[availableIndex] = pool.availableItems[
            pool.availableItems.length - 1
        ];
        pool.availableItems.pop();
        ERC721 erc721 = ERC721(nftContractAddress);
        erc721.safeTransferFrom(address(this), msg.sender, item.nftId);
        item.isInPool = false;
        emit ItemRemovedFromPool(item.id, poolId);
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) public pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    function requestRent(
        uint256 _categoryId,
        uint256 _duration,
        uint256 _price
    ) public returns (uint256 requestId) {
        require(
            pools[_categoryId].isActive,
            "Pool with the given category ID does not exist or is not active"
        );
        require(
            pools[_categoryId].availableItems.length > 0,
            "Pool with the given category ID has no available items to rent"
        );
        requestId = COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
        Rent memory newRent = Rent({
            requestId: requestId,
            initDate: block.timestamp,
            expirationDate: block.timestamp + _duration,
            finishDate: 0,
            price: _price,
            owner: address(0),
            rentee: msg.sender,
            poolId: _categoryId,
            itemId: 0,
            randomNumber: 0,
            status: RentStatus.REQUESTED
        });
        rents[requestId] = newRent;
        emit RentRequested(requestId, msg.sender, _categoryId);
        return requestId;
    }

    function startRent(uint256 requestId) public {
        require(
            rents[requestId].status == RentStatus.REQUEST_FULFILLED,
            "This Rent cannot start"
        );
        uint256 poolId = rents[requestId].poolId;
        Pool storage pool = pools[poolId];
        Rent storage rent = rents[requestId];

        uint256 index = rent.randomNumber % pool.availableItems.length;
        uint256 selectedItemId = pool.availableItems[index];

        Item storage item = items[selectedItemId];
        item.isRented = true;
        item.rentee = rents[requestId].rentee;
        pool.rentedItems.push(selectedItemId);
        pool.availableItems[index] = pool.availableItems[
            pool.availableItems.length - 1
        ];
        pool.availableItems.pop();
        require(item.isRented == true, "Item rent failed");
        require(item.rentee == msg.sender, "Item rentee update failed");
        require(
            pool.rentedItems[pool.rentedItems.length - 1] == selectedItemId,
            "Item not added to rented items"
        );
        require(
            pool.availableItems.length == 0 ||
                pool.availableItems[index] != selectedItemId,
            "Item not removed from available items"
        );
        rent.itemId = item.id;
        rent.owner = item.owner;
        rent.status = RentStatus.ACTIVE;
        emit RentStarted(requestId, poolId, item.rentee, item.nftId);
    }

    function finishRent(uint256 requestId) public {
        require(
            rents[requestId].status == RentStatus.ACTIVE,
            "This Rent is not Active"
        );
        Rent storage rent = rents[requestId];
        Item storage item = items[rent.itemId];
        Pool storage pool = pools[rent.poolId];

        require(item.isRented, "Item is not currently rented");
        require(
            item.rentee == msg.sender,
            "Only the rentee can finish the rent"
        );

        uint256 rentedIndex = findIndex(pool.rentedItems, item.id);
        require(
            rentedIndex < pool.rentedItems.length,
            "Item not found in rented items"
        );

        pool.rentedItems[rentedIndex] = pool.rentedItems[
            pool.rentedItems.length - 1
        ];
        pool.rentedItems.pop();
        pool.availableItems.push(item.id);
        item.isRented = false;
        item.rentee = address(0);
        rent.status = RentStatus.FINISHED;
        rent.finishDate = block.timestamp;

        emit RentFinished(rent.requestId, pool.categoryId, msg.sender, item.id);
    }

    function findIndex(
        uint256[] storage array,
        uint256 value
    ) internal view returns (uint256) {
        for (uint256 i = 0; i < array.length; i++) {
            if (array[i] == value) {
                return i;
            }
        }
        return array.length;
    }
}
