# Developer Guide

A comprehensive guide for developers working on or extending the AI Resume Matcher project.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Architecture](#architecture)
3. [Code Structure](#code-structure)
4. [Development Workflow](#development-workflow)
5. [Adding Features](#adding-features)
6. [Testing](#testing)
7. [Debugging](#debugging)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Prerequisites

- Node.js 16+ with npm
- Git
- Code editor (VS Code recommended)
- OpenAI API key

### Initial Setup

```bash
# Clone repository
git clone <repository-url>
cd ai-resume-matcher

# Install dependencies
cd frontend && npm install
cd ../backend && npm install

# Configure environment
cd backend
cp .env.example .env
# Edit .env with your OpenAI API key

# Start development
./start.sh  # or start.bat on Windows
```

### VS Code Extensions (Recommended)

- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- Thunder Client (API testing)
- Docker
- Thunder Client

---

## Architecture

### Component Diagram

```
Frontend (React)
├── App.js (Main component)
└── App.css (Styling)

Backend (Express)
├── server.js (Server setup)
├── routes/
│   └── match.js (API routes)
├── services/
│   ├── embeddingService.js (OpenAI)
│   └── endeeService.js (Vector DB client)
└── endee-server.js (Vector DB wrapper)

Endee (Vector Database)
└── REST API endpoints
```

### Data Flow

```
User Input
   ↓
Frontend (React)
   ↓
HTTP Request (Axios)
   ↓
Backend API (Express)
   ↓
┌─────────────────┐
│ Embedding       │
│ Service         │
│ (OpenAI)        │
└────────┬────────┘
         ↓
┌─────────────────┐
│ Endee Client    │
│ Service         │
└────────┬────────┘
         ↓
HTTP Request
   ↓
Endee Server
   ↓
Vector Search
   ↓
Results
   ↓
Backend API
   ↓
HTTP Response
   ↓
Frontend Display
```

---

## Code Structure

### Frontend

```
frontend/
├── src/
│   ├── App.js           # Main component (350 lines)
│   ├── App.css          # Styling (500 lines)
│   ├── index.js         # React entry point
│   ├── index.css        # Global styles
│   ├── setupTests.js    # Test configuration
│   └── reportWebVitals.js
├── public/
│   ├── index.html       # HTML template
│   ├── manifest.json    # PWA manifest
│   └── robots.txt
├── package.json
├── .env                 # Local config
├── .env.example         # Config template
├── Dockerfile           # Container image
└── .gitignore
```

#### App.js Structure

```javascript
function App() {
  // State Management
  const [resume, setResume] = useState("");
  const [job, setJob] = useState("");
  const [results, setResults] = useState(null);
  // ... more state
  
  // Effects
  useEffect(() => {
    checkServerHealth();
  }, []);
  
  // Event Handlers
  const handleUploadResume = async (e) => { /* ... */ }
  const handleMatchJob = async (e) => { /* ... */ }
  // ... more handlers
  
  // Render
  return (
    <div className="app">
      {/* Header */}
      {/* Resume Form */}
      {/* Job Form */}
      {/* Results */}
      {/* Footer */}
    </div>
  );
}
```

### Backend

```
backend/
├── server.js            # Express setup
├── endee-server.js      # Vector DB wrapper
├── routes/
│   └── match.js         # API endpoints
├── services/
│   ├── embeddingService.js  # OpenAI
│   └── endeeService.js      # Vector DB
├── package.json
├── .env                 # Configuration
├── .env.example         # Config template
├── Dockerfile           # Container image
├── .gitignore
└── README.md
```

#### Service Pattern

```javascript
// services/exampleService.js
async function processData(input) {
  try {
    // Validate
    if (!input) throw new Error('Input required');
    
    // Process
    const result = await someOperation(input);
    
    // Return
    return result;
  } catch (error) {
    console.error('Error:', error);
    throw new Error(`Operation failed: ${error.message}`);
  }
}

module.exports = { processData };
```

#### Route Pattern

```javascript
// routes/example.js
router.post('/endpoint', async (req, res, next) => {
  try {
    // Validate
    const { required } = req.body;
    if (!required) return res.status(400).json({ error: 'Missing field' });
    
    // Process
    const result = await service.process(required);
    
    // Respond
    res.status(200).json(result);
  } catch (error) {
    console.error('Error:', error);
    next({ status: 500, message: error.message });
  }
});
```

---

## Development Workflow

### 1. Starting Development

```bash
# Terminal 1 - Endee
cd backend
npm run endee

# Terminal 2 - Backend
cd backend
npm run dev    # Auto-reload with nodemon

# Terminal 3 - Frontend
cd frontend
npm start      # Auto-reload enabled
```

### 2. Making Changes

**Frontend Changes:**
1. Edit files in `frontend/src/`
2. Save file (auto-reload triggered)
3. Check browser console for errors
4. Test in browser

**Backend Changes:**
1. Edit files in `backend/`
2. Server auto-reloads (with nodemon)
3. Check terminal for errors
4. Test with cURL or API client

### 3. Committing Changes

```bash
# Check status
git status

# Stage changes
git add .

# Commit with message
git commit -m "feat: add new feature"

# Push to remote
git push origin feature-branch
```

### Git Commit Conventions

```
feat:    New feature
fix:     Bug fix
docs:    Documentation
style:   Formatting
refactor: Code restructuring
test:    Tests
chore:   Dependencies, build
```

---

## Adding Features

### Adding a Backend Endpoint

**1. Create the route handler:**

```javascript
// routes/match.js
router.post('/new-endpoint', async (req, res, next) => {
  try {
    // Validate input
    const { field } = req.body;
    if (!field) {
      return res.status(400).json({ error: 'Missing required field' });
    }
    
    // Process
    const result = await someService.process(field);
    
    // Return response
    res.status(200).json({
      message: 'Success',
      data: result
    });
  } catch (error) {
    console.error('Error:', error);
    next({ status: 500, message: error.message });
  }
});
```

**2. Test the endpoint:**

```bash
curl -X POST http://localhost:5000/api/new-endpoint \
  -H "Content-Type: application/json" \
  -d '{"field": "value"}'
```

**3. Update documentation:**
- Add to API_DOCUMENTATION.md
- Include examples
- Document error cases

### Adding a Frontend Component

**1. Create component:**

```javascript
// src/NewComponent.js
import React, { useState } from 'react';

export function NewComponent({ onSubmit }) {
  const [value, setValue] = useState('');
  
  const handleClick = () => {
    onSubmit(value);
    setValue('');
  };
  
  return (
    <div className="component">
      <input 
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button onClick={handleClick}>Submit</button>
    </div>
  );
}
```

**2. Add CSS:**

```css
/* App.css */
.component {
  margin: 1rem 0;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.component input {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.component button {
  background-color: var(--primary-color);
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
```

**3. Integrate into App.js:**

```javascript
import { NewComponent } from './NewComponent';

function App() {
  // ... existing code
  
  const handleNewSubmit = (value) => {
    console.log('New value:', value);
    // Handle submission
  };
  
  return (
    <div className="app">
      {/* ... existing JSX */}
      <NewComponent onSubmit={handleNewSubmit} />
    </div>
  );
}
```

### Adding an Environment Variable

**1. Add to .env.example:**
```env
NEW_VAR=value_here
```

**2. Add to .env:**
```env
NEW_VAR=actual_value
```

**3. Use in code:**

```javascript
// Backend
const newVar = process.env.NEW_VAR;

// Frontend
const newVar = process.env.REACT_APP_NEW_VAR;
```

---

## Testing

### Manual Testing

```bash
# Test endpoint
curl http://localhost:5000/api/stats

# Test with data
curl -X POST http://localhost:5000/api/upload-resume \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test",
    "resumeText": "Test resume content"
  }'
```

### Unit Testing

```javascript
// services/example.test.js
describe('Example Service', () => {
  test('should process input correctly', () => {
    const result = exampleService.process('input');
    expect(result).toEqual('expected');
  });
  
  test('should handle errors', () => {
    expect(() => {
      exampleService.process(null);
    }).toThrow();
  });
});
```

Run tests:
```bash
npm test
```

### React Component Testing

```javascript
// App.test.js
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders AI Resume Matcher heading', () => {
  render(<App />);
  expect(screen.getByText(/AI Resume Matcher/i)).toBeInTheDocument();
});
```

---

## Debugging

### Frontend Debugging

**1. Browser DevTools:**
```
Press F12 → Console tab
```

**2. React DevTools:**
- Install: "React Developer Tools" extension
- Use: Click extension icon
- Inspect components, state, props

**3. Network Tab:**
- F12 → Network tab
- Watch API requests
- Check response payloads

### Backend Debugging

**1. Console logging:**
```javascript
console.log('Value:', value);
console.error('Error:', error);
```

**2. Debug mode:**
```bash
node --inspect server.js
# Open chrome://inspect in Chrome
```

**3. Error checking:**
```bash
# Check logs in terminal
# Look for error stack traces
# Verify environment variables
```

### Using VS Code Debugger

**1. Create .vscode/launch.json:**
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Backend",
      "program": "${workspaceFolder}/backend/server.js"
    }
  ]
}
```

**2. Set breakpoints:** Click on line number
**3. Press F5 to start debugging
**4. Step through code with F10

---

## Best Practices

### Code Style

```javascript
// ✅ Good
const getUserId = (user) => {
  if (!user) return null;
  return user.id;
};

// ❌ Bad
function get_user_id(user) {
  if (user != null) {
    return user.id;
  }
}
```

### Error Handling

```javascript
// ✅ Good
async function processData(data) {
  try {
    validate(data);
    const result = await operation(data);
    return result;
  } catch (error) {
    console.error('Processing failed:', error);
    throw new Error(`Failed to process: ${error.message}`);
  }
}

// ❌ Bad
async function processData(data) {
  const result = await operation(data);
  return result;
}
```

### Comments

```javascript
// ✅ Good - explains WHY not WHAT
// Use Map instead of object for O(1) lookups
const cache = new Map();

// ❌ Bad - obvious
// Get the user
const user = getUser();
```

### Function Size

- Keep functions small (< 30 lines)
- One responsibility per function
- Testable units of code

### Variable Naming

```javascript
// ✅ Good
const isUserValid = true;
const errorMessage = 'Invalid input';
const maxRetries = 3;

// ❌ Bad
const valid = true;
const msg = 'Invalid input';
const n = 3;
```

---

## Troubleshooting

### Common Issues

#### Issue: "Port 5000 already in use"

**Solution:**
```bash
# Find process
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Or change port in .env
PORT=5001
```

#### Issue: "OpenAI API Error"

**Solution:**
- Verify API key in .env
- Check API key is not revoked
- Check account has credits
- Verify key is for correct organization

#### Issue: "Cannot connect to backend"

**Solution:**
- Verify backend is running: `npm start` in backend/
- Check port 5000 is accessible
- Verify no firewall blocking
- Check REACT_APP_API_URL in frontend/.env

#### Issue: "Module not found"

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### Issue: "Syntax Error"

**Solution:**
- Check line numbers in error
- Look for missing semicolons
- Verify bracket matching
- Check for typos in variable names

### Logging for Debugging

```javascript
// Log incoming request
router.post('/endpoint', (req, res) => {
  console.log('Request:', {
    body: req.body,
    headers: req.headers,
    timestamp: new Date().toISOString()
  });
  // ... rest of code
});

// Log before external call
console.log('Calling OpenAI API with:', { text });
const embedding = await openai.embeddings.create({ ... });
console.log('Embedding received, dimension:', embedding.data[0].embedding.length);

// Log errors with context
try {
  // ... code
} catch (error) {
  console.error('Operation failed:', {
    error: error.message,
    stack: error.stack,
    input: data
  });
}
```

---

## Performance Tips

### Frontend
- Lazy load components
- Memoize expensive computations
- Use CSS animations instead of JavaScript
- Minimize re-renders

### Backend
- Use connection pooling
- Cache frequently accessed data
- Index database queries
- Use pagination for large results

### General
- Monitor N+1 query problems
- Use compression (gzip)
- Cache API responses
- Implement rate limiting

---

## Security Checklist

- [ ] All inputs validated
- [ ] No secrets in code
- [ ] HTTPS enabled
- [ ] SQL injection protected
- [ ] XSS protection enabled
- [ ] CSRF tokens used
- [ ] Rate limiting enabled
- [ ] Error messages don't leak info
- [ ] Dependencies scanned for vulnerabilities
- [ ] Authentication implemented

---

## Resources

### Documentation
- [SETUP_GUIDE.md](SETUP_GUIDE.md)
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- [TESTING_GUIDE.md](TESTING_GUIDE.md)

### External Resources
- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Node.js Documentation](https://nodejs.org/docs)

### Tools
- [Thunder Client](https://www.thunderclient.io/) - API testing
- [Postman](https://www.postman.com/) - API client
- [VS Code](https://code.visualstudio.com/) - Code editor

---

## Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Update documentation
5. Commit with conventional messages
6. Push and create pull request
7. Address review feedback
8. Get approval
9. Merge to main

---

**Last Updated**: March 2026  
**Version**: 1.0.0  
**Status**: Production Ready
