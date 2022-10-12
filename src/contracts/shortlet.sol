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
        string typeOfApartment; 
        string image; 
        string location; 
        string wifi; 
        uint numberOfBedroom; 
        uint256 amount; 
        uint256 likes; 
    } 
 
 
    mapping(uint256 => Shortlet) shortlets; 
    uint256 shortletLength = 0; 
 
 
    address internal cUsdTokenAddress = 
        0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1; 
 
//add function for the shortlet 
 
    function addShortlet( 
        string memory _typeOfApartment, 
        string memory _image, 
        string memory _location, 
        string memory _wifi, 
        uint _numberOfBedroom, 
        uint256 _amount 
    ) public { 
        shortlets[shortletLength] = Shortlet( 
            payable(msg.sender), 
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
 
//get function for te short let apartments 
 
    function getShortlet(uint256 _index) 
        public 
        view 
        returns ( 
            address payable, 
            string memory, 
            string memory, 
            string memory, 
            string memory, 
            uint, 
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
 
//A function for users to like the apartments of their choice 
 
    function likeShortlet(uint256 _index) public { 
        shortlets[_index].likes++; 
        if (shortlets[_index].likes % 2 == 0) { 
            shortlets[_index].amount++; 
        } 
    } 
 
    //a function to rent a shortlet apartment 
 
    function buyShortlet(uint256 _index) public payable { 
        require( 
            IERC20Token(cUsdTokenAddress).transferFrom( 
                msg.sender, 
                shortlets[_index].owner, 
                shortlets[_index].amount 
            ), 
            "Transaction could not be performed" 
        ); 
        shortlets[_index].owner = payable(msg.sender); 
    } 
 
    //A function for users to rate the apartments of their choice 
 
    function rateShortlet(uint _index) public { 
            require(msg.sender == shortlets[_index].owner, "Invalid owner"); 
            shortlets[_index] = shortlets[shortletLength - 1]; 
    } 
 
    function getShortletLength() public view returns (uint256) { 
        return (shortletLength); 
    } 
}