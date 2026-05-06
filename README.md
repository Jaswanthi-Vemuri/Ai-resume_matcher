# AI Resume Matcher 

A sophisticated AI-powered resume matching system that leverages OpenAI embeddings and a high-performance vector database to intelligently match resumes against job descriptions.

**Live Demo**: http://localhost:3000 (when running)

## Quick Start

### Get Started in 5 Minutes

1. **Clone/Extract the project**
   ```bash
   cd ai-resume-matcher
   ```

2. **Set up environment**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env and add your OpenAI API key
   cd ..
   ```

3. **Start all services**
   ```bash
   # Windows
   start.bat
   
   # macOS/Linux
   chmod +x start.sh && ./start.sh
   ```

4. **Open browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api
   - Vector DB: http://localhost:8000

5. **Try it out!**
   - Upload a resume with a unique ID
   - Paste a job description
   - See AI-powered match scores


## Architecture

```
React Frontend (Port 3000)
         ↓
Express Backend API (Port 5000)
    ↙            ↘
OpenAI         Endee Vector DB
Embeddings      (Port 8000)
```

### Stack

- **Frontend**: React 19, Axios, CSS3
- **Backend**: Node.js, Express, OpenAI API
- **Database**: Endee (C++ vector database)
- **AI**: OpenAI text-embedding-3-small



### Implemented
- Upload and store resumes with embeddings
- Match job descriptions against stored resumes
- Real-time similarity scoring (0-100%)
- Responsive web UI
- Error handling and validation
- Server health monitoring
- REST API with comprehensive endpoints
- In-memory vector database (development)

### System Flow

```
1. User uploads resume
   ↓
2. Backend creates OpenAI embedding
   ↓
3. Embedding stored in Endee DB
   ↓
4. User enters job description
   ↓
5. Backend creates embedding for job
   ↓
6. Endee searches for similar resumes
   ↓
7. Results displayed with match scores
```

## Development

### Prerequisites

- Node.js 16+
- OpenAI API key
- Git

### Project Structure

```
ai-resume-matcher/
├── frontend/              # React web application
│   ├── src/
│   │   ├── App.js        # Main component
│   │   ├── App.css       # Styling
│   │   └── index.js
│   └── package.json
├── backend/              # Node.js API server
│   ├── server.js         # Express server
│   ├── endee-server.js   # Vector DB wrapper
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── .env              # Configuration
│   └── package.json
├── endee/                # Vector database (C++)
│   └── ...
├── SETUP_GUIDE.md        # Detailed guide
├── QUICK_START.md        # Quick setup
├── API_DOCUMENTATION.md  # API reference
└── docker-compose.yml    # Docker setup
```

### Running Individually

**Endee Vector Database:**
```bash
cd backend
npm run endee
```

**Backend Server:**
```bash
cd backend
npm start
```

**Frontend (Development):**
```bash
cd frontend
npm start
```

**Frontend (Production Build):**
```bash
cd frontend
npm run build
```

##  Docker Deployment

### Build and Run with Docker Compose

```bash
# Set your OpenAI API key
export OPENAI_API_KEY=sk_your_key_here

# Start all services
docker-compose up --build

# Stop services
docker-compose down
```

Services:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Endee: http://localhost:8000

## 📡 API Endpoints

### Upload Resume
```
POST /api/upload-resume
{
  "id": "john_doe",
  "resumeText": "..."
}
```

### Match Job
```
POST /api/match-job
{
  "jobDescription": "..."
}
```

### Get Statistics
```
GET /api/stats
```

### Clear All
```
DELETE /api/clear
```

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for complete API reference with examples.

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
PORT=5000
NODE_ENV=development
OPENAI_API_KEY=sk_...
ENDEE_URL=http://localhost:8000
ENDEE_PORT=8000
```

**Frontend (.env)**
```env
REACT_APP_API_URL=http://localhost:5000/api
```






- Express.js community

---

**Built with ❤️ for intelligent resume matching**

**Version**: 1.0.0 | **Last Updated**: March 2026

[Quick Start](QUICK_START.md) | [Setup Guide](SETUP_GUIDE.md) | [API Docs](API_DOCUMENTATION.md)
