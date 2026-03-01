/**
 * Endee Vector Database Server Wrapper
 * This module provides a Node.js HTTP wrapper around the Endee vector database
 */

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for vectors (for development)
// In production, this would connect to the actual Endee binary
const vectorStore = new Map();

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Endee server is running' });
});

/**
 * Store a vector
 * POST /vectors
 * Body: { id: string, values: number[] }
 */
app.post('/vectors', (req, res) => {
  try {
    const { id, values } = req.body;

    if (!id || !values || !Array.isArray(values)) {
      return res.status(400).json({
        error: 'Invalid request. Required: id (string), values (number array)',
      });
    }

    vectorStore.set(id, values);

    res.status(201).json({
      message: 'Vector stored successfully',
      id,
      dimension: values.length,
    });
  } catch (error) {
    console.error('Error storing vector:', error);
    res.status(500).json({ error: 'Failed to store vector' });
  }
});

/**
 * Retrieve a vector by ID
 * GET /vectors/:id
 */
app.get('/vectors/:id', (req, res) => {
  try {
    const { id } = req.params;
    const vector = vectorStore.get(id);

    if (!vector) {
      return res.status(404).json({ error: 'Vector not found' });
    }

    res.json({ id, values: vector, dimension: vector.length });
  } catch (error) {
    console.error('Error retrieving vector:', error);
    res.status(500).json({ error: 'Failed to retrieve vector' });
  }
});

/**
 * Search for similar vectors
 * POST /search
 * Body: { vector: number[], topK: number (optional) }
 */
app.post('/search', (req, res) => {
  try {
    const { vector, topK = 3 } = req.body;

    if (!vector || !Array.isArray(vector)) {
      return res.status(400).json({
        error: 'Invalid request. Required: vector (number array)',
      });
    }

    // Calculate similarity (cosine similarity)
    const results = Array.from(vectorStore.entries())
      .map(([id, storedVector]) => ({
        id,
        similarity: cosineSimilarity(vector, storedVector),
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);

    res.json({
      query_vector_dimension: vector.length,
      results,
      count: results.length,
    });
  } catch (error) {
    console.error('Error searching vectors:', error);
    res.status(500).json({ error: 'Failed to search vectors' });
  }
});

/**
 * Delete a vector by ID
 * DELETE /vectors/:id
 */
app.delete('/vectors/:id', (req, res) => {
  try {
    const { id } = req.params;

    if (!vectorStore.has(id)) {
      return res.status(404).json({ error: 'Vector not found' });
    }

    vectorStore.delete(id);
    res.json({ message: 'Vector deleted successfully', id });
  } catch (error) {
    console.error('Error deleting vector:', error);
    res.status(500).json({ error: 'Failed to delete vector' });
  }
});

/**
 * List all vectors (metadata only)
 * GET /vectors
 */
app.get('/vectors', (req, res) => {
  try {
    const vectors = Array.from(vectorStore.keys()).map((id) => ({
      id,
      dimension: vectorStore.get(id).length,
    }));

    res.json({
      total_vectors: vectors.length,
      vectors,
    });
  } catch (error) {
    console.error('Error listing vectors:', error);
    res.status(500).json({ error: 'Failed to list vectors' });
  }
});

/**
 * Clear all vectors
 * DELETE /vectors
 */
app.delete('/vectors', (req, res) => {
  try {
    const count = vectorStore.size;
    vectorStore.clear();

    res.json({
      message: 'All vectors cleared',
      cleared_count: count,
    });
  } catch (error) {
    console.error('Error clearing vectors:', error);
    res.status(500).json({ error: 'Failed to clear vectors' });
  }
});

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(vecA, vecB) {
  if (vecA.length !== vecB.length) {
    return 0;
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    magnitudeA += vecA[i] * vecA[i];
    magnitudeB += vecB[i] * vecB[i];
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Error handling middleware
 */
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

const PORT = process.env.ENDEE_PORT || 8000;

app.listen(PORT, () => {
  console.log(`Endee vector database server running on port ${PORT}`);
});

module.exports = app;
