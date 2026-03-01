# API Documentation

Complete API reference for AI Resume Matcher

## Base URLs

- **Backend API**: `http://localhost:5000/api`
- **Endee Vector DB**: `http://localhost:8000`
- **Frontend**: `http://localhost:3000`

## Table of Contents

1. [Backend API](#backend-api)
2. [Endee Vector Database API](#endee-api)
3. [Response Formats](#response-formats)
4. [Error Handling](#error-handling)
5. [Examples](#examples)

---

## Backend API

### 1. Upload Resume

Store a new resume with its embedding.

**Endpoint:**
```
POST /api/upload-resume
```

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "id": "john_doe_engineer",
  "resumeText": "John Doe\n...\nExperience: Senior Software Engineer..."
}
```

**Parameters:**
- `id` (string, required): Unique identifier for the resume
- `resumeText` (string, required): Full resume text content

**Response (201 Created):**
```json
{
  "message": "Resume stored successfully",
  "id": "john_doe_engineer",
  "embedding_dimension": 1536
}
```

**Error Responses:**
- 400: Missing required fields or empty text
- 500: OpenAI API error or database error

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/upload-resume \
  -H "Content-Type: application/json" \
  -d '{
    "id": "engineer_1",
    "resumeText": "John Doe\nSoftware Engineer\n..."
  }'
```

---

### 2. Match Job Description

Find the best matching resumes for a job description.

**Endpoint:**
```
POST /api/match-job
```

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "jobDescription": "We are looking for a Senior Software Engineer with 5+ years of experience..."
}
```

**Parameters:**
- `jobDescription` (string, required): Full job description text

**Response (200 OK):**
```json
{
  "job_description_preview": "We are looking for a Senior Software Engineer...",
  "matches_found": 2,
  "results": [
    {
      "id": "john_doe_engineer",
      "similarity": 0.8523
    },
    {
      "id": "jane_smith_developer",
      "similarity": 0.7812
    }
  ],
  "embedding_dimension": 1536
}
```

**Response Fields:**
- `job_description_preview`: First 100 characters of the input
- `matches_found`: Number of matching resumes
- `results`: Array of matches sorted by similarity (highest first)
  - `id`: Resume identifier
  - `similarity`: Match score from 0 to 1 (multiply by 100 for percentage)
- `embedding_dimension`: Dimension of the embeddings used

**Error Responses:**
- 400: Missing or empty job description
- 500: OpenAI API error or search error

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/match-job \
  -H "Content-Type: application/json" \
  -d '{
    "jobDescription": "Senior Engineer position with 5+ years experience..."
  }'
```

---

### 3. Get Statistics

Retrieve information about stored resumes.

**Endpoint:**
```
GET /api/stats
```

**Response (200 OK):**
```json
{
  "total_resumes_stored": 3,
  "resumes": [
    {
      "id": "john_doe_engineer",
      "dimension": 1536
    },
    {
      "id": "jane_smith_developer",
      "dimension": 1536
    },
    {
      "id": "bob_analyst",
      "dimension": 1536
    }
  ]
}
```

**Response Fields:**
- `total_resumes_stored`: Number of resumes in the database
- `resumes`: Array of resume metadata
  - `id`: Resume identifier
  - `dimension`: Embedding vector dimension

**cURL Example:**
```bash
curl http://localhost:5000/api/stats
```

---

### 4. Clear All Resumes

Delete all stored resumes and embeddings.

**Endpoint:**
```
DELETE /api/clear
```

**Response (200 OK):**
```json
{
  "message": "All resumes cleared"
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:5000/api/clear
```

---

### 5. Health Check

Check if the backend server is running.

**Endpoint:**
```
GET /health
```

**Response (200 OK):**
```json
{
  "status": "ok",
  "message": "Backend server is running"
}
```

**cURL Example:**
```bash
curl http://localhost:5000/health
```

---

## Endee API

Low-level vector database API (typically used internally by backend).

### 1. Store Vector

Store a single vector in the database.

**Endpoint:**
```
POST /vectors
```

**Request Body:**
```json
{
  "id": "resume_1",
  "values": [0.123, 0.456, 0.789, ...]
}
```

**Response (201 Created):**
```json
{
  "message": "Vector stored successfully",
  "id": "resume_1",
  "dimension": 1536
}
```

---

### 2. Retrieve Vector

Get a specific vector by ID.

**Endpoint:**
```
GET /vectors/{id}
```

**Response (200 OK):**
```json
{
  "id": "resume_1",
  "values": [0.123, 0.456, 0.789, ...],
  "dimension": 1536
}
```

---

### 3. Search Vectors

Find similar vectors using cosine similarity.

**Endpoint:**
```
POST /search
```

**Request Body:**
```json
{
  "vector": [0.123, 0.456, 0.789, ...],
  "topK": 3
}
```

**Parameters:**
- `vector` (array of numbers, required): Query vector
- `topK` (number, optional): Number of top results (default: 3)

**Response (200 OK):**
```json
{
  "query_vector_dimension": 1536,
  "results": [
    {
      "id": "resume_1",
      "similarity": 0.8523
    },
    {
      "id": "resume_2",
      "similarity": 0.7812
    }
  ],
  "count": 2
}
```

---

### 4. Delete Vector

Remove a vector by ID.

**Endpoint:**
```
DELETE /vectors/{id}
```

**Response (200 OK):**
```json
{
  "message": "Vector deleted successfully",
  "id": "resume_1"
}
```

---

### 5. List All Vectors

Get metadata about all stored vectors.

**Endpoint:**
```
GET /vectors
```

**Response (200 OK):**
```json
{
  "total_vectors": 3,
  "vectors": [
    {
      "id": "resume_1",
      "dimension": 1536
    },
    {
      "id": "resume_2",
      "dimension": 1536
    }
  ]
}
```

---

### 6. Clear All Vectors

Delete all vectors from the database.

**Endpoint:**
```
DELETE /vectors
```

**Response (200 OK):**
```json
{
  "message": "All vectors cleared",
  "cleared_count": 3
}
```

---

### 7. Health Check

Check if Endee server is running.

**Endpoint:**
```
GET /health
```

**Response (200 OK):**
```json
{
  "status": "ok",
  "message": "Endee server is running"
}
```

---

## Response Formats

### Success Response

All successful responses follow this pattern:

```json
{
  "message": "Operation successful",
  "data": {
    "key": "value"
  }
}
```

### Error Response

All error responses include:

```json
{
  "error": "Error message describing what went wrong"
}
```

In development mode:
```json
{
  "error": "Error message",
  "stack": "Stack trace for debugging..."
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Successfully retrieved data |
| 201 | Created | Vector/resume successfully stored |
| 400 | Bad Request | Missing required fields |
| 404 | Not Found | Vector/resume ID doesn't exist |
| 500 | Server Error | OpenAI API error, database error |

### Error Examples

**Missing Required Field:**
```json
{
  "error": "Missing required fields: resumeText, id"
}
```

**Empty Content:**
```json
{
  "error": "Resume text cannot be empty"
}
```

**API Key Error:**
```json
{
  "error": "Failed to create embedding: Invalid API key"
}
```

**Connection Error:**
```json
{
  "error": "Failed to store vector in Endee: Connect ECONNREFUSED"
}
```

---

## Examples

### JavaScript/Node.js

**Using Axios:**
```javascript
const axios = require('axios');

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Upload resume
async function uploadResume(id, text) {
  const response = await api.post('/upload-resume', {
    id,
    resumeText: text
  });
  return response.data;
}

// Match job
async function matchJob(jobDescription) {
  const response = await api.post('/match-job', {
    jobDescription
  });
  return response.data;
}

// Get statistics
async function getStats() {
  const response = await api.get('/stats');
  return response.data;
}

// Clear all
async function clearAll() {
  const response = await api.delete('/clear');
  return response.data;
}
```

### Python

**Using requests:**
```python
import requests
import json

BASE_URL = 'http://localhost:5000/api'

def upload_resume(resume_id, resume_text):
    response = requests.post(
        f'{BASE_URL}/upload-resume',
        json={
            'id': resume_id,
            'resumeText': resume_text
        }
    )
    return response.json()

def match_job(job_description):
    response = requests.post(
        f'{BASE_URL}/match-job',
        json={'jobDescription': job_description}
    )
    return response.json()

def get_stats():
    response = requests.get(f'{BASE_URL}/stats')
    return response.json()

# Usage
uploads = upload_resume('engineer_1', 'John Doe...')
results = match_job('Senior Engineer position...')
stats = get_stats()
```

### cURL

**Complete workflow:**
```bash
# 1. Upload a resume
curl -X POST http://localhost:5000/api/upload-resume \
  -H "Content-Type: application/json" \
  -d '{
    "id": "john_1",
    "resumeText": "John Doe\nSoftware Engineer\n5+ years experience\nSkills: Python, JavaScript, React"
  }' | jq .

# 2. Match a job
curl -X POST http://localhost:5000/api/match-job \
  -H "Content-Type: application/json" \
  -d '{
    "jobDescription": "We are looking for a Senior Software Engineer with 5+ years of JavaScript and React experience"
  }' | jq .

# 3. Get statistics
curl http://localhost:5000/api/stats | jq .

# 4. Clear all
curl -X DELETE http://localhost:5000/api/clear | jq .
```

---

## Rate Limiting

Currently, there are no rate limits implemented. For production use, consider adding:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
```

---

## Pagination

Currently not implemented. For large datasets, implement pagination:

```javascript
// GET /api/stats?page=1&limit=10
app.get('/stats', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  
  // Fetch with offset and limit
});
```

---

## Versioning

API versions can be added to support changes:

```
/api/v1/upload-resume
/api/v2/upload-resume
```

---

## Authentication (Future)

Consider adding authentication:

```javascript
// JWT token required
app.post('/api/upload-resume', authenticateToken, (req, res) => {
  // Protected endpoint
});
```

---

**Last Updated**: March 2026
**Version**: 1.0.0
