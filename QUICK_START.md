# Quick Start Guide

Get AI Resume Matcher running in 5 minutes!

## 1. Install Dependencies (1 min)

```bash
# Make sure you're in the project root directory
cd ai-resume-matcher

# Install frontend dependencies
cd frontend
npm install
cd ..

# Install backend dependencies
cd backend
npm install
cd ..
```

## 2. Configure OpenAI API (1 min)

1. Get your OpenAI API key from: https://platform.openai.com/api-keys
2. Edit `backend/.env`:
   ```
   OPENAI_API_KEY=sk-your_actual_key_here
   ```

## 3. Start All Services (1 min)

**Windows:**
```bash
start.bat
```

**macOS/Linux:**
```bash
chmod +x start.sh
./start.sh
```

Or manually start in separate terminals:
```bash
# Terminal 1 - Endee
cd backend && npm run endee

# Terminal 2 - Backend
cd backend && npm start

# Terminal 3 - Frontend
cd frontend && npm start
```

## 4. Open in Browser (1 min)

Go to: http://localhost:3000

## 5. Test It! (1 min)

1. **Add a Resume:**
   - Enter ID: `resume_1`
   - Paste any resume text
   - Click "Upload Resume"

2. **Match a Job:**
   - Paste a job description
   - Click "Find Matches"
   - See match scores!

## Verify All Services Are Running

- Frontend: http://localhost:3000 ✅
- Backend: http://localhost:5000/health ✅
- Endee: http://localhost:8000/health ✅

## Common Issues

| Problem | Fix |
|---------|-----|
| "Port 5000 already in use" | Change PORT in backend/.env |
| "OpenAI API Error" | Check your API key in backend/.env |
| "Cannot connect to server" | Make sure all 3 services are running |
| No matches appear | Upload at least one resume first |

## Next Steps

- Read [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed documentation
- Check API endpoints in the setup guide
- Build for production
- Deploy to cloud

---

**Need help?** Check the SETUP_GUIDE.md file for detailed troubleshooting.
