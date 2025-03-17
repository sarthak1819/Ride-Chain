const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RideSharing", function () {
  let rideSharing;
  let owner;
  let rider;
  let driver;
  let addr3;

  // Enum values
  const UserRole = {
    Rider: 0,
    Driver: 1
  };

  const RideStatus = {
    Available: 0,
    InProgress: 1,
    Completed: 2,
    Cancelled: 3
  };

  beforeEach(async function () {
    // Get signers
    [owner, rider, driver, addr3] = await ethers.getSigners();

    // Deploy the contract
    const RideSharing = await ethers.getContractFactory("RideSharing");
    rideSharing = await RideSharing.deploy();
  });

  describe("User Registration", function () {
    it("Should register a rider", async function () {
      await rideSharing.connect(rider).registerUser("John Doe", "1234567890", UserRole.Rider);
      
      const user = await rideSharing.users(rider.address);
      expect(user.name).to.equal("John Doe");
      expect(user.phoneNumber).to.equal("1234567890");
      expect(user.role).to.equal(UserRole.Rider);
      expect(user.isRegistered).to.equal(true);
    });

    it("Should register a driver", async function () {
      await rideSharing.connect(driver).registerUser("Jane Smith", "0987654321", UserRole.Driver);
      
      const user = await rideSharing.users(driver.address);
      expect(user.name).to.equal("Jane Smith");
      expect(user.phoneNumber).to.equal("0987654321");
      expect(user.role).to.equal(UserRole.Driver);
      expect(user.isRegistered).to.equal(true);
    });

    it("Should not allow registering twice", async function () {
      await rideSharing.connect(rider).registerUser("John Doe", "1234567890", UserRole.Rider);
      
      await expect(
        rideSharing.connect(rider).registerUser("John Doe 2", "1234567890", UserRole.Rider)
      ).to.be.revertedWith("User already registered");
    });
  });

  describe("Ride Management", function () {
    beforeEach(async function () {
      // Register users
      await rideSharing.connect(rider).registerUser("John Doe", "1234567890", UserRole.Rider);
      await rideSharing.connect(driver).registerUser("Jane Smith", "0987654321", UserRole.Driver);
    });

    it("Should request a ride", async function () {
      const fare = ethers.parseEther("0.1");
      await rideSharing.connect(rider).requestRide("Location A", "Location B", fare, { value: fare });
      
      const rideId = 0;
      const ride = await rideSharing.rides(rideId);
      
      expect(ride.rider).to.equal(rider.address);
      expect(ride.pickupLocation).to.equal("Location A");
      expect(ride.dropoffLocation).to.equal("Location B");
      expect(ride.fare).to.equal(fare);
      expect(ride.status).to.equal(RideStatus.Available);
    });

    it("Should accept a ride", async function () {
      const fare = ethers.parseEther("0.1");
      await rideSharing.connect(rider).requestRide("Location A", "Location B", fare, { value: fare });
      
      await rideSharing.connect(driver).acceptRide(0);
      
      const ride = await rideSharing.rides(0);
      expect(ride.driver).to.equal(driver.address);
      expect(ride.status).to.equal(RideStatus.InProgress);
    });

    it("Should complete a ride", async function () {
      const fare = ethers.parseEther("0.1");
      await rideSharing.connect(rider).requestRide("Location A", "Location B", fare, { value: fare });
      await rideSharing.connect(driver).acceptRide(0);
      
      await rideSharing.connect(driver).completeRide(0);
      
      const ride = await rideSharing.rides(0);
      expect(ride.status).to.equal(RideStatus.Completed);
      
      // Check driver balance
      const platformFeePercentage = await rideSharing.getPlatformFeePercentage();
      const platformFee = fare * platformFeePercentage / 10000n;
      const driverPayment = fare - platformFee;
      
      const driverBalance = await rideSharing.getUserBalance(driver.address);
      expect(driverBalance).to.equal(driverPayment);
    });

    it("Should cancel a ride", async function () {
      const fare = ethers.parseEther("0.1");
      await rideSharing.connect(rider).requestRide("Location A", "Location B", fare, { value: fare });
      
      await rideSharing.connect(rider).cancelRide(0);
      
      const ride = await rideSharing.rides(0);
      expect(ride.status).to.equal(RideStatus.Cancelled);
    });
  });

  describe("Rating System", function () {
    beforeEach(async function () {
      // Register users
      await rideSharing.connect(rider).registerUser("John Doe", "1234567890", UserRole.Rider);
      await rideSharing.connect(driver).registerUser("Jane Smith", "0987654321", UserRole.Driver);
      
      // Complete a ride
      const fare = ethers.parseEther("0.1");
      await rideSharing.connect(rider).requestRide("Location A", "Location B", fare, { value: fare });
      await rideSharing.connect(driver).acceptRide(0);
      await rideSharing.connect(driver).completeRide(0);
    });

    it("Should allow rating after sharing a ride", async function () {
      await rideSharing.connect(rider).rateUser(driver.address, 5);
      
      const driverRating = await rideSharing.getUserRating(driver.address);
      expect(driverRating).to.equal(5);
    });

    it("Should not allow rating without sharing a ride", async function () {
      await expect(
        rideSharing.connect(addr3).rateUser(driver.address, 5)
      ).to.be.revertedWith("User not registered");
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to set platform fee percentage", async function () {
      await rideSharing.connect(owner).setPlatformFeePercentage(1000); // 10%
      
      const feePercentage = await rideSharing.getPlatformFeePercentage();
      expect(feePercentage).to.equal(1000);
    });

    it("Should not allow non-owner to set platform fee percentage", async function () {
      await expect(
        rideSharing.connect(rider).setPlatformFeePercentage(1000)
      ).to.be.reverted;
    });
  });
}); 