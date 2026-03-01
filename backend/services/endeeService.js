const axios = require('axios');

const ENDEE_URL = process.env.ENDEE_URL || 'http://localhost:8000';

if (!ENDEE_URL) {
  throw new Error('ENDEE_URL environment variable is not set');
}

const endeeClient = axios.create({
  baseURL: ENDEE_URL,
  timeout: 30000,
});

/**
 * Store vector in Endee database
 * @param {string} id - Unique identifier for the vector
 * @param {number[]} vector - The vector data
 */
async function storeVector(id, vector) {
  try {
    if (!id || !vector || !Array.isArray(vector)) {
      throw new Error('Invalid parameters: id and vector array required');
    }

    const response = await endeeClient.post('/vectors', {
      id,
      values: vector,
    });

    return response.data;
  } catch (error) {
    console.error('Error storing vector:', error.message);
    throw new Error(
      `Failed to store vector in Endee: ${error.message}`
    );
  }
}

/**
 * Search for similar vectors in Endee database
 * @param {number[]} vector - The query vector
 * @param {number} topK - Number of top results to return (default: 3)
 * @returns {Promise<object>} - Search results
 */
async function searchVector(vector, topK = 3) {
  try {
    if (!vector || !Array.isArray(vector)) {
      throw new Error('Invalid parameter: vector array required');
    }

    const response = await endeeClient.post('/search', {
      vector,
      topK,
    });

    return response.data;
  } catch (error) {
    console.error('Error searching vectors:', error.message);
    throw new Error(
      `Failed to search vectors in Endee: ${error.message}`
    );
  }
}

/**
 * Delete vector from Endee database
 * @param {string} id - The vector id to delete
 */
async function deleteVector(id) {
  try {
    const response = await endeeClient.delete(`/vectors/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting vector:', error.message);
    throw new Error(`Failed to delete vector from Endee: ${error.message}`);
  }
}

/**
 * Get all vectors from Endee database
 */
async function getAllVectors() {
  try {
    const response = await endeeClient.get('/vectors');
    return response.data;
  } catch (error) {
    console.error('Error getting vectors:', error.message);
    throw new Error(`Failed to get vectors from Endee: ${error.message}`);
  }
}

/**
 * Health check for Endee server
 */
async function healthCheck() {
  try {
    const response = await endeeClient.get('/health');
    return response.data;
  } catch (error) {
    console.error('Endee health check failed:', error.message);
    throw new Error(`Endee server is not available: ${error.message}`);
  }
}

module.exports = {
  storeVector,
  searchVector,
  deleteVector,
  getAllVectors,
  healthCheck,
};