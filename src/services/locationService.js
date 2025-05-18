/**
 * Service to handle location data from provinces.open-api.vn
 */

const BASE_URL = 'https://provinces.open-api.vn/api';

/**
 * Fetches all provinces/cities from the API
 * @returns {Promise<Array>} Array of provinces
 */
const getProvinces = async () => {
  try {
    const response = await fetch(`${BASE_URL}/`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      success: true,
      data: data,
      count: data.length
    };
  } catch (error) {
    console.error('Error fetching provinces:', error);
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
};

/**
 * Fetches detailed province data including districts
 * @param {number} provinceCode - The code of the province
 * @returns {Promise<Object>} Province with its districts
 */
const getProvinceWithDistricts = async (provinceCode) => {
  try {
    const response = await fetch(`${BASE_URL}/p/${provinceCode}?depth=2`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      success: true,
      data: data
    };
  } catch (error) {
    console.error(`Error fetching districts for province ${provinceCode}:`, error);
    return {
      success: false,
      error: error.message,
      data: null
    };
  }
};

/**
 * Fetches detailed district data including wards
 * @param {number} districtCode - The code of the district
 * @returns {Promise<Object>} District with its wards
 */
const getDistrictWithWards = async (districtCode) => {
  try {
    const response = await fetch(`${BASE_URL}/d/${districtCode}?depth=2`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      success: true,
      data: data
    };
  } catch (error) {
    console.error(`Error fetching wards for district ${districtCode}:`, error);
    return {
      success: false,
      error: error.message,
      data: null
    };
  }
};

/**
 * Fetches all data: provinces, districts and wards in a hierarchical structure
 * @returns {Promise<Array>} Hierarchical location data
 */
const getAllLocations = async () => {
  try {
    const response = await fetch(`${BASE_URL}/p`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      success: true,
      data: data,
      count: data.length
    };
  } catch (error) {
    console.error('Error fetching all location data:', error);
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
};

export const locationService = {
  getProvinces,
  getProvinceWithDistricts,
  getDistrictWithWards,
  getAllLocations
};
