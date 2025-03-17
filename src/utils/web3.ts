import { ethers } from 'ethers';
import RideSharingArtifact from '../artifacts/contracts/RideSharing.sol/RideSharing.json';

// Contract address will be set after deployment
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '';

// Types
export enum UserRole {
  Rider = 0,
  Driver = 1
}

export enum RideStatus {
  Available = 0,
  InProgress = 1,
  Completed = 2,
  Cancelled = 3
}

export interface User {
  wallet: string;
  name: string;
  phoneNumber: string;
  role: UserRole;
  isRegistered: boolean;
  rating: number;
  totalRatings: number;
}

export interface Ride {
  id: number;
  rider: string;
  driver: string;
  pickupLocation: string;
  dropoffLocation: string;
  fare: bigint;
  timestamp: number;
  status: RideStatus;
  isRated: boolean;
}

// Web3 connection
let provider: ethers.BrowserProvider | null = null;
let signer: ethers.Signer | null = null;
let contract: ethers.Contract | null = null;

// Initialize Web3
export const initWeb3 = async () => {
  if (window.ethereum) {
    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      provider = new ethers.BrowserProvider(window.ethereum);
      signer = await provider.getSigner();
      
      contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        RideSharingArtifact.abi,
        signer
      );
      
      return true;
    } catch (error) {
      console.error('User denied account access', error);
      return false;
    }
  } else {
    console.error('No Ethereum browser extension detected');
    return false;
  }
};

// Check if user is connected
export const isConnected = async (): Promise<boolean> => {
  if (!provider) return false;
  
  try {
    const accounts = await provider.listAccounts();
    return accounts.length > 0;
  } catch (error) {
    console.error('Error checking connection', error);
    return false;
  }
};

// Get current account
export const getCurrentAccount = async (): Promise<string | null> => {
  if (!provider) return null;
  
  try {
    const accounts = await provider.listAccounts();
    return accounts[0].address;
  } catch (error) {
    console.error('Error getting current account', error);
    return null;
  }
};

// Contract interaction functions
export const registerUser = async (name: string, phoneNumber: string, role: UserRole): Promise<boolean> => {
  if (!contract || !signer) {
    await initWeb3();
    if (!contract || !signer) return false;
  }
  
  try {
    console.log(`Registering user with role: ${role} (${role === UserRole.Rider ? 'Rider' : 'Driver'})`);
    const tx = await contract.registerUser(name, phoneNumber, role);
    console.log("Registration transaction sent:", tx.hash);
    const receipt = await tx.wait();
    console.log("Registration transaction confirmed:", receipt.hash);
    return true;
  } catch (error) {
    console.error('Error registering user', error);
    return false;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  if (!contract || !signer) {
    await initWeb3();
    if (!contract || !signer) return null;
  }
  
  try {
    const account = await getCurrentAccount();
    if (!account) return null;
    
    const user = await contract.users(account);
    console.log("Raw user data from contract:", user);
    
    const userData = {
      wallet: user.wallet,
      name: user.name,
      phoneNumber: user.phoneNumber,
      role: user.role,
      isRegistered: user.isRegistered,
      rating: Number(user.rating),
      totalRatings: Number(user.totalRatings)
    };
    
    console.log("Parsed user data:", userData);
    console.log(`User role: ${userData.role} (${userData.role === UserRole.Rider ? 'Rider' : 'Driver'})`);
    
    return userData;
  } catch (error) {
    console.error('Error getting current user', error);
    return null;
  }
};

export const requestRide = async (pickupLocation: string, dropoffLocation: string, fare: string): Promise<boolean> => {
  if (!contract || !signer) {
    await initWeb3();
    if (!contract || !signer) return false;
  }
  
  try {
    const fareWei = ethers.parseEther(fare);
    const tx = await contract.requestRide(pickupLocation, dropoffLocation, fareWei, { value: fareWei });
    await tx.wait();
    return true;
  } catch (error) {
    console.error('Error requesting ride', error);
    return false;
  }
};

export const acceptRide = async (rideId: number): Promise<boolean> => {
  if (!contract || !signer) {
    await initWeb3();
    if (!contract || !signer) return false;
  }
  
  try {
    const tx = await contract.acceptRide(rideId);
    await tx.wait();
    return true;
  } catch (error) {
    console.error('Error accepting ride', error);
    return false;
  }
};

export const completeRide = async (rideId: number): Promise<boolean> => {
  if (!contract || !signer) {
    await initWeb3();
    if (!contract || !signer) return false;
  }
  
  try {
    const tx = await contract.completeRide(rideId);
    await tx.wait();
    return true;
  } catch (error) {
    console.error('Error completing ride', error);
    return false;
  }
};

export const cancelRide = async (rideId: number): Promise<boolean> => {
  if (!contract || !signer) {
    await initWeb3();
    if (!contract || !signer) return false;
  }
  
  try {
    const tx = await contract.cancelRide(rideId);
    await tx.wait();
    return true;
  } catch (error) {
    console.error('Error cancelling ride', error);
    return false;
  }
};

export const rateUser = async (userAddress: string, rating: number): Promise<boolean> => {
  if (!contract || !signer) {
    await initWeb3();
    if (!contract || !signer) return false;
  }
  
  try {
    const tx = await contract.rateUser(userAddress, rating);
    await tx.wait();
    return true;
  } catch (error) {
    console.error('Error rating user', error);
    return false;
  }
};

export const withdrawFunds = async (): Promise<boolean> => {
  if (!contract || !signer) {
    await initWeb3();
    if (!contract || !signer) return false;
  }
  
  try {
    const tx = await contract.withdrawFunds();
    await tx.wait();
    return true;
  } catch (error) {
    console.error('Error withdrawing funds', error);
    return false;
  }
};

export const getUserRides = async (userAddress?: string): Promise<Ride[]> => {
  if (!contract || !signer) {
    await initWeb3();
    if (!contract || !signer) return [];
  }
  
  try {
    const address = userAddress || await getCurrentAccount();
    if (!address) return [];
    
    const rideIds = await contract.getUserRides(address);
    const rides: Ride[] = [];
    
    for (const id of rideIds) {
      const ride = await contract.rides(id);
      rides.push({
        id: Number(ride.id),
        rider: ride.rider,
        driver: ride.driver,
        pickupLocation: ride.pickupLocation,
        dropoffLocation: ride.dropoffLocation,
        fare: ride.fare,
        timestamp: Number(ride.timestamp),
        status: ride.status,
        isRated: ride.isRated
      });
    }
    
    return rides;
  } catch (error) {
    console.error('Error getting user rides', error);
    return [];
  }
};

export const getAvailableDrivers = async (): Promise<string[]> => {
  if (!contract || !signer) {
    await initWeb3();
    if (!contract || !signer) return [];
  }
  
  try {
    return await contract.getAvailableDrivers();
  } catch (error) {
    console.error('Error getting available drivers', error);
    return [];
  }
};

export const getUserBalance = async (): Promise<string> => {
  if (!contract || !signer) {
    await initWeb3();
    if (!contract || !signer) return '0';
  }
  
  try {
    const account = await getCurrentAccount();
    if (!account) return '0';
    
    const balance = await contract.getUserBalance(account);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error('Error getting user balance', error);
    return '0';
  }
}; 