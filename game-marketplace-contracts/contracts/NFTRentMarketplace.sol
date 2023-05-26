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
    //VRF
    event VRFRequestSent(uint256 requestId, uint32 numWords);
    event VRFRequestFulfilled(uint256 requestId, uint256[] randomWords);
    struct VRFRequestStatus {
        bool fulfilled;
        bool exists;
        uint256[] randomWords;
    }
    mapping(uint256 => VRFRequestStatus) public s_requests;
    VRFCoordinatorV2Interface public COORDINATOR;
    uint64 private s_subscriptionId;
    uint256[] public requestIds;
    uint256 public lastRequestId;
    bytes32 private keyHash =
        0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f;
    uint32 private callbackGasLimit = 100000;
    uint16 private requestConfirmations = 3;
    uint32 private numWords = 1;

    //NFTRentMarketplace
    struct Item {
        uint256 nftId;
        uint256 poolId;
        bool isRented;
        uint256 categoryId;
        address payable owner;
        address rentee;
    }

    struct Pool {
        //only 1 pool to 1 category
        //poolId will be == to one categoryId
        uint256 categoryId;
        bool isActive;
        uint256[] availableItems;
        uint256[] rentedItems;
    }
    enum RentStatus {
        REQUESTED, // Solicitação de aluguel feita
        IN_PROGRESS, // Aluguel em andamento
        COMPLETED, // Aluguel concluído
        ERROR, // Erro ocorrido durante o processo de aluguel
        CANCELLED // Aluguel cancelado
    }
    struct RentRequest {
        bool fulfilled;
        bool exists;
        uint256 randomNumber;
        address rentee;
        uint256 poolId;
        RentStatus status;
    }
    mapping(uint256 => RentRequest) public rentRequests;
    uint256[] public rentRequestsIds;
    mapping(uint256 => Pool) private pools;
    mapping(uint256 => Item) private items;

    event PoolDisabled(uint256 poolId);
    event RentRequested(
        uint256 indexed requestId,
        address requester,
        uint256 poolId
    );
    event RentStarted(uint256 indexed requestId);
    event PoolEnabled(uint256 poolId);
    event PoolCreated(uint256 indexed poolId);
    event ItemAddedToPool(uint256 itemId, uint256 poolId);
    event ItemCreated(
        uint256 indexed itemId,
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

    function requestRandomWords()
        external
        onlyOwner
        returns (uint256 requestId)
    {
        requestId = COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
        s_requests[requestId] = VRFRequestStatus({
            randomWords: new uint256[](0),
            exists: true,
            fulfilled: false
        });
        requestIds.push(requestId);
        lastRequestId = requestId;
        emit VRFRequestSent(requestId, numWords);
        return requestId;
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        require(rentRequests[_requestId].exists, "request not found");
        rentRequests[_requestId].fulfilled = true;
        rentRequests[_requestId].randomNumber = _randomWords[0];
        emit VRFRequestFulfilled(_requestId, _randomWords);
    }

    function getRentRequestStatus(
        uint256 _requestId
    ) external view returns (bool fulfilled, address rentee) {
        require(rentRequests[_requestId].exists, "Rent request not found");
        RentRequest memory request = rentRequests[_requestId];
        return (request.fulfilled, request.rentee);
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
        require(items[_nftId].owner == address(0), "Item already exists");
        items[_nftId] = Item({
            nftId: _nftId,
            owner: payable(msg.sender),
            categoryId: _categoryId,
            rentee: address(0),
            isRented: false,
            poolId: 0
        });
        emit ItemCreated(_nftId, _categoryId, msg.sender);
    }

    function getItem(uint256 _itemNftId) public view returns (Item memory) {
        return items[_itemNftId];
    }

    function getPool(
        uint256 _categoryId
    )
        public
        view
        returns (
            uint256 categoryId,
            bool isActive,
            uint256[] memory availableItems,
            uint256[] memory rentedItems
        )
    {
        Pool storage pool = pools[_categoryId];
        return (
            pool.categoryId,
            pool.isActive,
            pool.availableItems,
            pool.rentedItems
        );
    }

    function addItemToPool(uint256 _itemNftId, uint256 _categoryId) public {
        Pool storage pool = pools[_categoryId];
        require(
            pool.isActive,
            "Pool with the given category ID does not exist or is not active"
        );

        Item memory item = getItem(_itemNftId);
        require(
            item.owner == msg.sender,
            "Only item owner can add it to a pool"
        );
        require(item.poolId == 0, "Item already in a pool");

        ERC721 erc721 = ERC721(nftContractAddress);
        erc721.safeTransferFrom(msg.sender, address(this), _itemNftId);
    }

    function onERC721Received(
        address,
        address,
        uint256 tokenId,
        bytes calldata
    ) public override returns (bytes4) {
        uint256 _categoryId = items[tokenId].categoryId;
        pools[_categoryId].availableItems.push(tokenId);
        items[tokenId].poolId = _categoryId;

        emit ItemAddedToPool(tokenId, _categoryId);

        return this.onERC721Received.selector;
    }

    function requestRent(
        uint256 _categoryId
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
        rentRequestsIds.push(requestId);
        lastRequestId = requestId;
        rentRequests[requestId] = RentRequest({
            randomNumber: 0,
            exists: true,
            fulfilled: false,
            rentee: msg.sender,
            poolId: _categoryId,
            status: RentStatus.REQUESTED
        });
        emit RentRequested(requestId, msg.sender, _categoryId);
        return requestId;
    }

    function startRentItem(uint256 requestId, uint256 randomResult) public {
        require(rentRequests[requestId].exists, "request not found");
        require(
            rentRequests[requestId].fulfilled,
            "random number not yet available"
        );

        uint256 poolId = rentRequests[requestId].poolId;

        Pool storage pool = pools[poolId];

        uint256 index = randomResult % pool.availableItems.length;
        uint256 selectedItemId = pool.availableItems[index];

        // Update the item and pool
        Item storage item = items[selectedItemId];
        item.isRented = true;
        item.rentee = rentRequests[requestId].rentee;
        emit RentStarted(requestId);
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
    }
}