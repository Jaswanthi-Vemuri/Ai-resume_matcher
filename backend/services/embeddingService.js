const OpenAI = require('openai');

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is not set');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Create embedding for text using OpenAI API
 * @param {string} text - The text to create embedding for
 * @returns {Promise<number[]>} - Array of embedding values
 */
async function createEmbedding(text) {
  try {
    if (!text || text.trim().length === 0) {
      throw new Error('Text cannot be empty');
    }

    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });

    if (!response.data || response.data.length === 0) {
      throw new Error('No embedding returned from OpenAI API');
    }

    return response.data[0].embedding;
  } catch (error) {
    console.error('Embedding creation error:', error.message);
    throw new Error(`Failed to create embedding: ${error.message}`);
  }
}

module.exports = { createEmbedding };