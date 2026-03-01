const express = require('express');
const router = express.Router();
const { createEmbedding } = require('../services/embeddingService');
const { storeVector, searchVector } = require('../services/endeeService');

/**
 * Upload and store resume
 * POST /upload-resume
 */
router.post('/upload-resume', async (req, res, next) => {
  try {
    const { resumeText, id } = req.body;

    // Validation
    if (!resumeText || !id) {
      return res.status(400).json({
        error: 'Missing required fields: resumeText, id',
      });
    }

    if (resumeText.trim().length === 0) {
      return res.status(400).json({
        error: 'Resume text cannot be empty',
      });
    }

    // Create embedding from resume text
    console.log(`Creating embedding for resume ID: ${id}`);
    const embedding = await createEmbedding(resumeText);

    // Store in Endee vector database
    console.log(`Storing vector for resume ID: ${id}`);
    await storeVector(id, embedding);

    res.status(201).json({
      message: 'Resume stored successfully',
      id,
      embedding_dimension: embedding.length,
    });
  } catch (error) {
    console.error('Error uploading resume:', error.message);
    next({
      status: 500,
      message: 'Failed to upload resume: ' + error.message,
    });
  }
});

/**
 * Match job description with stored resumes
 * POST /match-job
 */
router.post('/match-job', async (req, res, next) => {
  try {
    const { jobDescription } = req.body;

    // Validation
    if (!jobDescription) {
      return res.status(400).json({
        error: 'Missing required field: jobDescription',
      });
    }

    if (jobDescription.trim().length === 0) {
      return res.status(400).json({
        error: 'Job description cannot be empty',
      });
    }

    // Create embedding from job description
    console.log('Creating embedding for job description');
    const embedding = await createEmbedding(jobDescription);

    // Search for similar resumes
    console.log('Searching for matching resumes');
    const results = await searchVector(embedding);

    res.json({
      job_description_preview: jobDescription.slice(0, 100) + '...',
      matches_found: results.results ? results.results.length : 0,
      results: results.results || [],
      embedding_dimension: embedding.length,
    });
  } catch (error) {
    console.error('Error matching job:', error.message);
    next({
      status: 500,
      message: 'Failed to match job: ' + error.message,
    });
  }
});

/**
 * Get stats about stored resumes
 * GET /stats
 */
router.get('/stats', async (req, res, next) => {
  try {
    const statsResponse = await require('axios').get(
      `${process.env.ENDEE_URL}/vectors`
    );

    res.json({
      total_resumes_stored: statsResponse.data.total_vectors,
      resumes: statsResponse.data.vectors,
    });
  } catch (error) {
    console.error('Error fetching stats:', error.message);
    next({
      status: 500,
      message: 'Failed to fetch statistics: ' + error.message,
    });
  }
});

/**
 * Clear all stored resumes
 * DELETE /clear
 */
router.delete('/clear', async (req, res, next) => {
  try {
    await require('axios').delete(`${process.env.ENDEE_URL}/vectors`);

    res.json({
      message: 'All resumes cleared',
    });
  } catch (error) {
    console.error('Error clearing resumes:', error.message);
    next({
      status: 500,
      message: 'Failed to clear resumes: ' + error.message,
    });
  }
});

module.exports = router;