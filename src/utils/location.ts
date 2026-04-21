/**
 * Location utility for Geocoding and Distance Calculation
 * Uses OpenStreetMap Nominatim (Free, No API Key required)
 */

export interface GeoLocation {
  name: string;
  lat: number;
  lon: number;
}

/**
 * Search for a location and return the best match
 */
export const searchLocation = async (query: string): Promise<GeoLocation | null> => {
  if (!query || query.length < 3) return null;
  
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
      {
        headers: {
          'Accept-Language': 'en-US,en;q=0.9',
          'User-Agent': 'RideChain-DApp' // Good practice for Nominatim
        }
      }
    );
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        name: data[0].display_name,
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon)
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error searching location:', error);
    return null;
  }
};

/**
 * Calculate distance between two points in KM using Haversine formula
 */
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

/**
 * Calculate fare based on distance
 * @param distanceInKm Distance in kilometers
 * @param basePrice Base protocol fee in ETH
 * @param perKmPrice Price per kilometer in ETH
 */
export const calculateFare = (distanceInKm: number, basePrice: number = 0.005, perKmPrice: number = 0.001): string => {
  const total = basePrice + (distanceInKm * perKmPrice);
  // Cap at 4 decimal places for ETH readability
  return total.toFixed(4);
};
