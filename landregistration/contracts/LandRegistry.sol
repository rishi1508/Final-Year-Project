// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract LandRegistry {
    struct Land {
        uint256 id;
        string plotNumber;
        string area;
        string district;
        string city;
        string state;
        uint256 areaSqYd;
        address owner;
        bool isForSale;
        address transferRequest;
    }

    struct OwnershipHistory {
        address owner;
        uint256 timestamp;
    }

    uint256 public landCount;
    mapping(uint256 => Land) public lands;
    mapping(address => uint256[]) public ownerLands;
    mapping(uint256 => OwnershipHistory[]) public landOwnershipHistory;

    // Add a mapping to check for duplicate land registrations
    mapping(bytes32 => bool) private landExists;

    // Define admin address as a constant
    address public constant ADMIN_ADDRESS =
        0x7F585D7A9751a7388909Ed940E29732306A98f0c;
    address public admin = ADMIN_ADDRESS; // Initialize admin with constant

    event LandRegistered(
        uint256 id,
        address owner,
        string plotNumber,
        string area,
        string district,
        string city,
        string state,
        uint256 areaSqYd
    );
    event LandForSale(uint256 id, address owner);
    event TransferRequested(uint256 id, address requester);
    event LandTransferred(uint256 id, address from, address to);
    event TransferApproved(uint256 id, address newOwner);
    event TransferDenied(uint256 id, address requester);

    constructor() {
        landCount = 0;
        // No need to set admin here; it's initialized above
    }

    modifier onlyOwner(uint256 _landId) {
        require(
            lands[_landId].owner == msg.sender,
            "You are not the owner of this land"
        );
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    function registerLand(
        string memory _plotNumber,
        string memory _area,
        string memory _district,
        string memory _city,
        string memory _state,
        uint256 _areaSqYd
    ) public {
        // Create a unique hash of the land details to check for duplicates
        bytes32 landHash = keccak256(
            abi.encodePacked(_plotNumber, _district, _state)
        );

        // Check if a land with the same details already exists
        require(
            !landExists[landHash],
            "Error: Land with these details is already registered"
        );

        landCount++;
        lands[landCount] = Land(
            landCount,
            _plotNumber,
            _area,
            _district,
            _city,
            _state,
            _areaSqYd,
            msg.sender,
            false,
            address(0)
        );

        // Mark this land as existing
        landExists[landHash] = true;

        ownerLands[msg.sender].push(landCount);
        landOwnershipHistory[landCount].push(
            OwnershipHistory(msg.sender, block.timestamp)
        );
        emit LandRegistered(
            landCount,
            msg.sender,
            _plotNumber,
            _area,
            _district,
            _city,
            _state,
            _areaSqYd
        );
    }

    function putLandForSale(uint256 _landId) public onlyOwner(_landId) {
        lands[_landId].isForSale = true;
        emit LandForSale(_landId, msg.sender);
    }

    function requestTransfer(uint256 _landId) public {
        require(lands[_landId].isForSale, "Land is not for sale");
        require(
            lands[_landId].transferRequest == address(0),
            "Transfer already requested"
        );
        require(
            msg.sender != lands[_landId].owner,
            "Owner cannot request transfer"
        );
        lands[_landId].transferRequest = msg.sender;
        emit TransferRequested(_landId, msg.sender);
    }

    function approveTransfer(uint256 _landId) public onlyOwner(_landId) {
        require(
            lands[_landId].transferRequest != address(0),
            "No transfer request pending"
        );
        address newOwner = lands[_landId].transferRequest;

        uint256[] storage ownerLandList = ownerLands[msg.sender];
        for (uint256 i = 0; i < ownerLandList.length; i++) {
            if (ownerLandList[i] == _landId) {
                ownerLandList[i] = ownerLandList[ownerLandList.length - 1];
                ownerLandList.pop();
                break;
            }
        }

        lands[_landId].owner = newOwner;
        lands[_landId].isForSale = false;
        lands[_landId].transferRequest = address(0);
        ownerLands[newOwner].push(_landId);
        landOwnershipHistory[_landId].push(
            OwnershipHistory(newOwner, block.timestamp)
        );

        emit LandTransferred(_landId, msg.sender, newOwner);
        emit TransferApproved(_landId, newOwner);
    }

    function denyTransfer(uint256 _landId) public onlyOwner(_landId) {
        require(
            lands[_landId].transferRequest != address(0),
            "No transfer request pending"
        );
        address requester = lands[_landId].transferRequest;
        lands[_landId].transferRequest = address(0);
        emit TransferDenied(_landId, requester);
    }

    function verifyLand(
        uint256 _landId
    )
        public
        view
        returns (
            string memory plotNumber,
            string memory area,
            string memory district,
            string memory city,
            string memory state,
            uint256 areaSqYd,
            address owner
        )
    {
        Land memory land = lands[_landId];
        return (
            land.plotNumber,
            land.area,
            land.district,
            land.city,
            land.state,
            land.areaSqYd,
            land.owner
        );
    }

    function getLandsByOwner(
        address _owner
    ) public view returns (uint256[] memory) {
        return ownerLands[_owner];
    }

    function getPendingTransferRequests(
        address _owner
    ) public view returns (uint256[] memory) {
        uint256[] memory ownedLands = ownerLands[_owner];
        uint256 pendingCount = 0;

        for (uint256 i = 0; i < ownedLands.length; i++) {
            if (lands[ownedLands[i]].transferRequest != address(0)) {
                pendingCount++;
            }
        }

        uint256[] memory pendingRequests = new uint256[](pendingCount);
        uint256 index = 0;
        for (uint256 i = 0; i < ownedLands.length; i++) {
            if (lands[ownedLands[i]].transferRequest != address(0)) {
                pendingRequests[index] = ownedLands[i];
                index++;
            }
        }

        return pendingRequests;
    }

    function getAllLands() public view onlyAdmin returns (Land[] memory) {
        Land[] memory allLands = new Land[](landCount);
        for (uint256 i = 1; i <= landCount; i++) {
            allLands[i - 1] = lands[i];
        }
        return allLands;
    }

    function getPastOwnershipDetails(
        uint256 _landId
    ) public view onlyAdmin returns (OwnershipHistory[] memory) {
        return landOwnershipHistory[_landId];
    }
}
