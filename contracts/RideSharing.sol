// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title RideSharing
 * @dev A decentralized ride sharing platform on the blockchain
 */
contract RideSharing is Ownable, ReentrancyGuard {
    // Enums
    enum RideStatus { Available, InProgress, Completed, Cancelled }
    enum UserRole { Rider, Driver }

    // Structs
    struct User {
        address wallet;
        string name;
        string phoneNumber;
        UserRole role;
        bool isRegistered;
        uint256 rating;
        uint256 totalRatings;
    }

    struct Ride {
        uint256 id;
        address rider;
        address driver;
        string pickupLocation;
        string dropoffLocation;
        uint256 fare;
        uint256 timestamp;
        RideStatus status;
        bool isRated;
    }

    // State variables
    uint256 private rideCounter;
    uint256 private platformFeePercentage; // in basis points (1% = 100)
    
    mapping(address => User) public users;
    mapping(uint256 => Ride) public rides;
    mapping(address => uint256[]) public userRides;
    mapping(address => uint256) public balances;
    
    address[] public availableDrivers;

    // Events
    event UserRegistered(address indexed userAddress, string name, UserRole role);
    event RideRequested(uint256 indexed rideId, address indexed rider, string pickupLocation, string dropoffLocation, uint256 fare);
    event RideAccepted(uint256 indexed rideId, address indexed driver);
    event RideCompleted(uint256 indexed rideId);
    event RideCancelled(uint256 indexed rideId);
    event UserRated(address indexed rated, address indexed rater, uint256 rating);
    event FundsWithdrawn(address indexed user, uint256 amount);

    // Constructor
    constructor() {
        platformFeePercentage = 500; // 5% by default
    }

    // Modifiers
    modifier onlyRegistered() {
        require(users[msg.sender].isRegistered, "User not registered");
        _;
    }

    modifier onlyRider() {
        require(users[msg.sender].isRegistered && users[msg.sender].role == UserRole.Rider, "Only riders can perform this action");
        _;
    }

    modifier onlyDriver() {
        require(users[msg.sender].isRegistered && users[msg.sender].role == UserRole.Driver, "Only drivers can perform this action");
        _;
    }

    modifier rideExists(uint256 _rideId) {
        require(_rideId < rideCounter, "Ride does not exist");
        _;
    }

    // Functions
    function registerUser(string memory _name, string memory _phoneNumber, UserRole _role) external {
        require(!users[msg.sender].isRegistered, "User already registered");
        
        users[msg.sender] = User({
            wallet: msg.sender,
            name: _name,
            phoneNumber: _phoneNumber,
            role: _role,
            isRegistered: true,
            rating: 0,
            totalRatings: 0
        });
        
        if (_role == UserRole.Driver) {
            availableDrivers.push(msg.sender);
        }
        
        emit UserRegistered(msg.sender, _name, _role);
    }

    function requestRide(string memory _pickupLocation, string memory _dropoffLocation, uint256 _fare) external payable onlyRider {
        require(msg.value >= _fare, "Insufficient payment for ride");
        
        rides[rideCounter] = Ride({
            id: rideCounter,
            rider: msg.sender,
            driver: address(0),
            pickupLocation: _pickupLocation,
            dropoffLocation: _dropoffLocation,
            fare: _fare,
            timestamp: block.timestamp,
            status: RideStatus.Available,
            isRated: false
        });
        
        userRides[msg.sender].push(rideCounter);
        
        emit RideRequested(rideCounter, msg.sender, _pickupLocation, _dropoffLocation, _fare);
        
        rideCounter++;
    }

    function acceptRide(uint256 _rideId) external onlyDriver rideExists(_rideId) {
        Ride storage ride = rides[_rideId];
        
        require(ride.status == RideStatus.Available, "Ride is not available");
        require(ride.driver == address(0), "Ride already has a driver");
        
        ride.driver = msg.sender;
        ride.status = RideStatus.InProgress;
        
        // Remove driver from available drivers list
        removeDriverFromAvailable(msg.sender);
        
        userRides[msg.sender].push(_rideId);
        
        emit RideAccepted(_rideId, msg.sender);
    }

    function completeRide(uint256 _rideId) external onlyDriver rideExists(_rideId) nonReentrant {
        Ride storage ride = rides[_rideId];
        
        require(ride.driver == msg.sender, "Only assigned driver can complete the ride");
        require(ride.status == RideStatus.InProgress, "Ride is not in progress");
        
        ride.status = RideStatus.Completed;
        
        // Calculate platform fee
        uint256 platformFee = (ride.fare * platformFeePercentage) / 10000;
        uint256 driverPayment = ride.fare - platformFee;
        
        // Add payment to driver's balance
        balances[ride.driver] += driverPayment;
        
        // Add driver back to available drivers
        availableDrivers.push(msg.sender);
        
        emit RideCompleted(_rideId);
    }

    function cancelRide(uint256 _rideId) external rideExists(_rideId) {
        Ride storage ride = rides[_rideId];
        
        require(ride.status == RideStatus.Available || ride.status == RideStatus.InProgress, "Ride cannot be cancelled");
        require(msg.sender == ride.rider || msg.sender == ride.driver, "Only rider or driver can cancel");
        
        ride.status = RideStatus.Cancelled;
        
        // Refund rider
        if (ride.status == RideStatus.Available || ride.status == RideStatus.InProgress) {
            payable(ride.rider).transfer(ride.fare);
        }
        
        // If driver cancelled, add back to available
        if (msg.sender == ride.driver) {
            availableDrivers.push(msg.sender);
        }
        
        emit RideCancelled(_rideId);
    }

    function rateUser(address _user, uint256 _rating) external onlyRegistered {
        require(_rating >= 1 && _rating <= 5, "Rating must be between 1 and 5");
        require(users[_user].isRegistered, "User to rate is not registered");
        require(hasSharedRide(msg.sender, _user), "You haven't shared a ride with this user");
        
        User storage userToRate = users[_user];
        
        // Update rating
        uint256 totalPoints = userToRate.rating * userToRate.totalRatings;
        userToRate.totalRatings += 1;
        userToRate.rating = (totalPoints + _rating) / userToRate.totalRatings;
        
        emit UserRated(_user, msg.sender, _rating);
    }

    function withdrawFunds() external onlyRegistered nonReentrant {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "No funds to withdraw");
        
        balances[msg.sender] = 0;
        
        payable(msg.sender).transfer(amount);
        
        emit FundsWithdrawn(msg.sender, amount);
    }

    // Helper functions
    function removeDriverFromAvailable(address _driver) internal {
        for (uint i = 0; i < availableDrivers.length; i++) {
            if (availableDrivers[i] == _driver) {
                // Replace with the last element and pop
                availableDrivers[i] = availableDrivers[availableDrivers.length - 1];
                availableDrivers.pop();
                break;
            }
        }
    }

    function hasSharedRide(address _user1, address _user2) internal view returns (bool) {
        for (uint i = 0; i < userRides[_user1].length; i++) {
            uint256 rideId = userRides[_user1][i];
            Ride storage ride = rides[rideId];
            
            if ((ride.rider == _user1 && ride.driver == _user2) || 
                (ride.rider == _user2 && ride.driver == _user1)) {
                return true;
            }
        }
        return false;
    }

    // Admin functions
    function setPlatformFeePercentage(uint256 _feePercentage) external onlyOwner {
        require(_feePercentage <= 3000, "Fee percentage too high"); // Max 30%
        platformFeePercentage = _feePercentage;
    }

    function withdrawPlatformFees() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        payable(owner()).transfer(balance);
    }

    // View functions
    function getUserRides(address _user) external view returns (uint256[] memory) {
        return userRides[_user];
    }

    function getAvailableDrivers() external view returns (address[] memory) {
        return availableDrivers;
    }

    function getUserRating(address _user) external view returns (uint256) {
        require(users[_user].isRegistered, "User not registered");
        return users[_user].rating;
    }

    function getPlatformFeePercentage() external view returns (uint256) {
        return platformFeePercentage;
    }

    function getUserBalance(address _user) external view returns (uint256) {
        return balances[_user];
    }
} 