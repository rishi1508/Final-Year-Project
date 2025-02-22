// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract LandRegistry {
    struct Land {
        uint256 id;
        string location;
        uint256 area;
        address owner;
    }

    uint256 public landCount;
    mapping(uint256 => Land) public lands;
    mapping(address => uint256[]) public ownerLands;

    event LandRegistered(
        uint256 id,
        address owner,
        string location,
        uint256 area
    );
    event LandTransferred(uint256 id, address from, address to);

    constructor() {
        landCount = 0;
    }

    modifier onlyOwner(uint256 _landId) {
        require(
            lands[_landId].owner == msg.sender,
            "You are not the owner of this land"
        );
        _;
    }

    //registers land
    function registerLand(string memory _location, uint256 _area) public {
        landCount++;
        lands[landCount] = Land(landCount, _location, _area, msg.sender);
        ownerLands[msg.sender].push(landCount);
        emit LandRegistered(landCount, msg.sender, _location, _area);
    }

    function transferLand(
        uint256 _landId,
        address _to
    ) public onlyOwner(_landId) {
        require(_to != address(0), "Invalid address");

        // remove landId from current owner's list
        uint256[] storage ownerLandList = ownerLands[msg.sender];
        for (uint256 i = 0; i < ownerLandList.length; i++) {
            if (ownerLandList[i] == _landId) {
                ownerLandList[i] = ownerLandList[ownerLandList.length - 1];
                ownerLandList.pop();
                break;
            }
        }

        // transfer ownership
        lands[_landId].owner = _to;
        ownerLands[_to].push(_landId);
        emit LandTransferred(_landId, msg.sender, _to);
    }

    //verifies land ownership
    function verifyLand(
        uint256 _landId
    )
        public
        view
        returns (string memory location, uint256 area, address owner)
    {
        Land memory land = lands[_landId];
        return (land.location, land.area, land.owner);
    }

    function getLandsByOwner(
        address _owner
    ) public view returns (uint256[] memory) {
        return ownerLands[_owner];
    }
}
