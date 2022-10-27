// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

interface IERC20Token {
    function transfer(address, uint256) external returns (bool);

    function approve(address, uint256) external returns (bool);

    function transferFrom(
        address,
        address,
        uint256
    ) external returns (bool);

    function totalSupply() external view returns (uint256);

    function balanceOf(address) external view returns (uint256);

    function allowance(address, address) external view returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

//Shortlet is modeled in the formart of a short stay apartment which can be used in place of hotels

contract houseShortlet {
    struct Shortlet {
        address payable owner;
        address renter;
        uint256 rentedTill;
        string typeOfApartment;
        string image;
        string location;
        bool wifi;
        uint256 numberOfBedroom;
        uint256 amount;
        uint256 likes;
    }

    mapping(uint256 => Shortlet) private shortlets;
    mapping(uint256 => mapping(address => bool)) private liked;
    uint256 private shortletLength = 0;

    address private cUsdTokenAddress =
        0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    /// @dev add function for the shortlet
    /// @notice Input needs to contain only valid/non-empty values
    function addShortlet(
        string calldata _typeOfApartment,
        string calldata _image,
        string calldata _location,
        bool _wifi,
        uint256 _numberOfBedroom,
        uint256 _amount
    ) public {
        require(bytes(_typeOfApartment).length > 0, "Empty type for apartment");
        require(bytes(_image).length > 0, "Empty image");
        require(bytes(_location).length > 0, "Empty location");
        require(_numberOfBedroom > 0, "Invalid number of rooms");

        shortlets[shortletLength] = Shortlet(
            payable(msg.sender),
            address(0),
            0,
            _typeOfApartment,
            _image,
            _location,
            _wifi,
            _numberOfBedroom,
            _amount,
            0
        );

        shortletLength++;
    }

    /// @dev getter function for the short let apartments
    function getShortlet(uint256 _index)
        public
        view
        returns (
            address payable,
            string memory,
            string memory,
            string memory,
            bool,
            uint256,
            uint256,
            uint256
        )
    {
        Shortlet storage shortlet = shortlets[_index];
        return (
            shortlet.owner,
            shortlet.typeOfApartment,
            shortlet.image,
            shortlet.location,
            shortlet.wifi,
            shortlet.numberOfBedroom,
            shortlet.amount,
            shortlet.likes
        );
    }

    /// @dev A function for users to like the apartments of their choice
    function likeShortlet(uint256 _index) public {
        require(
            !liked[_index][msg.sender],
            "You have already liked this apartment"
        );
        liked[_index][msg.sender] = true;
        shortlets[_index].likes++;
    }

    /// @dev A function to rent a shortlet apartment
    function rentShortlet(uint256 _index, uint256 rentTime) public payable {
        Shortlet storage currentShortlet = shortlets[_index];
        // for testing purposes, rentTime can be allowed to be much lower
        require(
            rentTime >= 1 days && rentTime < 150 days,
            "Rent time needs to be between 1 day and 6 months"
        );
        require(
            currentShortlet.rentedTill == 0 &&
                currentShortlet.renter == address(0),
            "Shortlet is currently being rented"
        );
        if (currentShortlet.owner != msg.sender) {
            require(
                IERC20Token(cUsdTokenAddress).transferFrom(
                    msg.sender,
                    currentShortlet.owner,
                    currentShortlet.amount
                ),
                "Transaction could not be performed"
            );
        }
        currentShortlet.rentedTill = rentTime + block.timestamp;
        currentShortlet.renter = msg.sender;
    }

    /// @dev allow a shortlet's owner or renter to end the renting of the shortlet
    function endRentShortlet(uint256 _index) public payable {
        Shortlet storage currentShortlet = shortlets[_index];
        require(
            currentShortlet.rentedTill < block.timestamp,
            "Rent period is not over yet"
        );
        require(
            currentShortlet.owner == msg.sender ||
                currentShortlet.renter == msg.sender,
            "Unauthorized caller"
        );
        currentShortlet.rentedTill = 0;
        currentShortlet.renter = address(0);
    }

    function getShortletLength() public view returns (uint256) {
        return (shortletLength);
    }
}
