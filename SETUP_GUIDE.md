# AI Resume Matcher - Complete Setup Guide

A sophisticated AI-powered resume matching system that uses OpenAI embeddings and a vector database for intelligent resume-job matching.

## System Architecture

```
┌─────────────────────────┐
│   React Frontend        │ (Port 3000)
│   - Resume Upload       │
│   - Job Matching        │
│   - Results Display     │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│   Express Backend       │ (Port 5000)
│   - REST API Routes     │
│   - Embedding Service   │
│   - Vector Operations   │
└────────────┬────────────┘
             │
    ┌────────┴────────┐
    ▼                 ▼
┌──────────────┐  ┌──────────────┐
│   OpenAI     │  │ Endee Vector │
│ Embeddings   │  │  Database    │
│   API        │  │  (Port 8000) │
└──────────────┘  └──────────────┘
```

## Project Structure

```
ai-resume-matcher/
├── frontend/                 # React web application
│   ├── public/
│   ├── src/
│   │   ├── App.js           # Main component with UI
│   │   ├── App.css          # Styling
│   │   ├── index.js         # React entry point
│   │   └── ...
│   └── package.json
│
├── backend/                  # Node.js/Express server
│   ├── services/
│   │   ├── embeddingService.js  # OpenAI integration
│   │   └── endeeService.js      # Vector DB integration
│   ├── routes/
│   │   └── match.js             # API routes
│   ├── server.js                # Express server
│   ├── endee-server.js          # Endee wrapper
│   ├── .env                     # Environment variables
│   ├── .env.example             # Example env file
│   └── package.json
│
├── endee/                    # C++ Vector Database
│   ├── src/                 # Source code
│   ├── CMakeLists.txt
│   └── ...
│
├── start.sh                 # Startup script (Unix/Linux/macOS)
└── start.bat                # Startup script (Windows)
```

## Prerequisites

### Required

1. **Node.js** (v16 or higher)
   - Download from: https://nodejs.org/

2. **OpenAI API Key**
   - Sign up at: https://platform.openai.com
   - Get your API key from: https://platform.openai.com/api-keys

3. **Git** (for cloning)
   - Download from: https://git-scm.com/

### Optional

- **C++ Build Tools** (only if building Endee from source)
  - Endee is already compiled; source building is optional

## Step-by-Step Installation

### 1. Clone or Extract the Project

```bash
cd ai-resume-matcher
```

### 2. Configure Backend Environment

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and add your OpenAI API key:

```env
PORT=5000
NODE_ENV=development
OPENAI_API_KEY=sk-your_actual_key_here
ENDEE_URL=http://localhost:8000
ENDEE_PORT=8000
```

### 3. Install Dependencies

**Backend:**
```bash
cd backend
npm install
cd ..
```

**Frontend:**
```bash
cd frontend
npm install
cd ..
```

### 4. Configure Frontend Environment (Optional)

Create `frontend/.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Running the Application

### Option 1: Automatic Startup (Recommended)

**For Windows:**
```bash
start.bat
```

**For Linux/macOS:**
```bash
chmod +x start.sh
./start.sh
```

### Option 2: Manual Startup

**Terminal 1 - Start Endee Vector Database:**
```bash
cd backend
npm run endee
```
Service runs on: `http://localhost:8000`

**Terminal 2 - Start Backend Server:**
```bash
cd backend
npm start
```
Service runs on: `http://localhost:5000`
- Health check: `http://localhost:5000/health`
- API: `http://localhost:5000/api`

**Terminal 3 - Start Frontend:**
```bash
cd frontend
npm start
```
Service runs on: `http://localhost:3000`

## API Endpoints

### Backend API Base URL
```
http://localhost:5000/api
```

### Available Endpoints

#### 1. Upload Resume
```
POST /upload-resume
Content-Type: application/json

{
  "id": "john_doe_engineer",
  "resumeText": "Your resume text here..."
}

Response: 201 Created
{
  "message": "Resume stored successfully",
  "id": "john_doe_engineer",
  "embedding_dimension": 1536
}
```

#### 2. Match Job Description
```
POST /match-job
Content-Type: application/json

{
  "jobDescription": "Job description text here..."
}

Response: 200 OK
{
  "job_description_preview": "...",
  "matches_found": 2,
  "results": [
    {
      "id": "john_doe_engineer",
      "similarity": 0.85
    },
    {
      "id": "jane_smith_developer",
      "similarity": 0.78
    }
  ],
  "embedding_dimension": 1536
}
```

#### 3. Get Statistics
```
GET /stats

Response: 200 OK
{
  "total_resumes_stored": 2,
  "resumes": [
    {
      "id": "john_doe_engineer",
      "dimension": 1536
    },
    {
      "id": "jane_smith_developer",
      "dimension": 1536
    }
  ]
}
```

#### 4. Clear All Resumes
```
DELETE /clear

Response: 200 OK
{
  "message": "All resumes cleared"
}
```

### Endee Vector Database API

#### Store Vector
```
POST http://localhost:8000/vectors
Content-Type: application/json

{
  "id": "vector_id",
  "values": [0.1, 0.2, 0.3, ...]
}
```

#### Search Vectors
```
POST http://localhost:8000/search
Content-Type: application/json

{
  "vector": [0.1, 0.2, 0.3, ...],
  "topK": 3
}
```

#### Health Check
```
GET http://localhost:8000/health
```

## Features

### Frontend Features
- ✅ Clean, responsive UI
- ✅ Resume upload with unique ID
- ✅ Job description matching
- ✅ Real-time match scoring (0-100%)
- ✅ Server health status indicator
- ✅ Stored resumes list
- ✅ Clear all resumes function
- ✅ Error handling and user feedback
- ✅ Loading states

### Backend Features
- ✅ OpenAI text embeddings (text-embedding-3-small)
- ✅ Vector storage and search
- ✅ Cosine similarity scoring
- ✅ Comprehensive error handling
- ✅ Request validation
- ✅ Health check endpoints
- ✅ Statistics and logging
- ✅ CORS support

### Endee Vector Database Features
- ✅ In-memory vector storage (for development)
- ✅ Cosine similarity search
- ✅ Top-K retrieval
- ✅ Vector CRUD operations
- ✅ REST API interface

## Usage Examples

### Example 1: Add a Resume and Match a Job

1. Open `http://localhost:3000`
2. Fill in Resume ID: `engineer_2024`
3. Paste a resume in the Resume Text area
4. Click "Upload Resume"
5. In the "Match Job Description" section, paste a job description
6. Click "Find Matches"
7. View the match score (0-100%)

### Example 2: Using cURL

```bash
# Upload a resume
curl -X POST http://localhost:5000/api/upload-resume \
  -H "Content-Type: application/json" \
  -d '{
    "id": "john_engineer",
    "resumeText": "Your resume content here..."
  }'

# Match a job
curl -X POST http://localhost:5000/api/match-job \
  -H "Content-Type: application/json" \
  -d '{
    "jobDescription": "Senior Engineer position..."
  }'

# Get statistics
curl http://localhost:5000/api/stats
```

## Troubleshooting

### Issue: "Port X is already in use"
**Solution:**
- Windows: `netstat -ano | findstr :8000` (find process), then `taskkill /PID <PID> /F`
- Linux/macOS: `lsof -i :8000 | grep LISTEN` (find process), then `kill -9 <PID>`

### Issue: "OpenAI API Error"
**Solution:**
- Verify your API key in `backend/.env`
- Check that your account has credits
- Ensure the API key hasn't expired

### Issue: "Cannot connect to Endee"
**Solution:**
- Verify Endee server is running on port 8000
- Check `backend/.env` for correct ENDEE_URL
- Clear browser cache and try again

### Issue: Frontend shows "Server: OFFLINE"
**Solution:**
- Make sure backend is running on port 5000
- Check browser console for CORS errors
- Verify `frontend/.env` has correct API URL

### Issue: "Module not found" errors
**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json  # (or delete folder on Windows)
npm install
```

## Environment Variables

### Backend (.env)
```env
PORT=5000                                  # Backend server port
NODE_ENV=development                       # Environment mode
OPENAI_API_KEY=sk-your_key_here           # OpenAI API key
ENDEE_URL=http://localhost:8000           # Endee server URL
ENDEE_PORT=8000                           # Endee server port
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api  # Backend API URL
```

## Performance Considerations

### Embedding Model
- **Model**: text-embedding-3-small
- **Dimension**: 1536
- **Cost**: Efficient and fast
- **Latency**: ~1-2 seconds per embedding

### Vector Search
- **Algorithm**: Cosine Similarity
- **Complexity**: O(n*d) where n=vectors, d=dimensions
- **Scaling**: Suitable for up to 10,000+ resumes in memory

### Tips for Better Matching
1. Use complete resume text (not abbreviated)
2. Use detailed job descriptions
3. Include relevant keywords in both texts
4. Consider preprocessing (remove HTML, formatting)

## Development

### Running in Development Mode

**Backend with auto-reload:**
```bash
cd backend
npm run dev  # Requires nodemon
```

### Running Tests

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## Building for Production

### Frontend Build
```bash
cd frontend
npm run build
# Output: frontend/build/
```

### Deployment Checklist
- [ ] Set `NODE_ENV=production` in backend
- [ ] Update `.env` with production URLs
- [ ] Use environment-specific configurations
- [ ] Enable HTTPS
- [ ] Set up proper error logging
- [ ] Configure CORS for your domain
- [ ] Use production OpenAI API key
- [ ] Consider using a production vector database (not in-memory)

## Technology Stack

### Frontend
- **Framework**: React 19
- **HTTP Client**: Axios
- **Styling**: CSS3
- **Build Tool**: Create React App

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **AI Integration**: OpenAI API
- **HTTP Client**: Axios

### Vector Database
- **Name**: Endee (nD)
- **Language**: C++
- **API**: REST HTTP
- **Algorithm**: HNSW + Cosine Similarity

## Contributing

To contribute improvements:

1. Create a branch for your feature
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## Troubleshooting Common Issues

| Issue | Solution |
|-------|----------|
| CORS Error | Update REACT_APP_API_URL or CORS config |
| 401 Unauthorized | Check OpenAI API key |
| 503 Service Unavailable | Verify Endee server is running |
| Slow responses | Check network and API quota |
| No matches found | Verify resumes are uploaded and match exists |

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review error logs in the terminal
3. Check OpenAI status page
4. Review code comments for implementation details

## License

This project is open source. Check LICENSE file for details.

## Future Enhancements

- [ ] Batch uploading for multiple resumes
- [ ] Advanced filtering (skills, experience level)
- [ ] Resume scoring and feedback
- [ ] Job category classification
- [ ] Persistent vector database (PostgreSQL + pgvector)
- [ ] Authentication and user accounts
- [ ] Resume parsing from PDF/DOCX
- [ ] Real-time notifications
- [ ] Analytics and reporting

---

**Last Updated**: March 2026
**Version**: 1.0.0
