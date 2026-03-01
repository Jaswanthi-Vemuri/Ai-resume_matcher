# Testing Guide

Complete testing guide for AI Resume Matcher

## Manual Testing

### Prerequisites
- All three services running (Frontend, Backend, Endee)
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Endee: http://localhost:8000

## Test Scenarios

### 1. Server Health Check

**Test**: Verify all servers are running

```bash
# Frontend
curl http://localhost:3000

# Backend
curl http://localhost:5000/health

# Endee
curl http://localhost:8000/health
```

**Expected Results**:
- Frontend: HTML response with React app
- Backend: JSON with `{"status": "ok", "message": "..."}`
- Endee: JSON with `{"status": "ok", "message": "..."}`

---

### 2. Upload Single Resume

**Test**: Upload a resume and verify storage

```bash
curl -X POST http://localhost:5000/api/upload-resume \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test_resume_1",
    "resumeText": "John Doe\nSoftware Engineer\nExperience:\n- 5 years Python development\n- 3 years JavaScript/React\n- AWS and Docker experience\nSkills: Python, JavaScript, React, AWS, Docker, PostgreSQL"
  }'
```

**Expected Response** (201):
```json
{
  "message": "Resume stored successfully",
  "id": "test_resume_1",
  "embedding_dimension": 1536
}
```

**Verification**:
```bash
curl http://localhost:5000/api/stats
```

Should show 1 resume stored.

---

### 3. Upload Multiple Resumes

**Test**: Upload 3 different resumes

```bash
# Resume 2
curl -X POST http://localhost:5000/api/upload-resume \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test_resume_2",
    "resumeText": "Jane Smith\nData Scientist\nExperience:\n- 4 years machine learning\n- Python and R expertise\n- Statistical analysis\nSkills: Python, R, Machine Learning, TensorFlow, SQL"
  }'

# Resume 3
curl -X POST http://localhost:5000/api/upload-resume \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test_resume_3",
    "resumeText": "Bob Johnson\nDevOps Engineer\nExperience:\n- 6 years infrastructure\n- Kubernetes and Docker expert\n- CI/CD pipelines\nSkills: Kubernetes, Docker, AWS, Jenkins, Terraform, Python"
  }'
```

**Verification**:
```bash
curl http://localhost:5000/api/stats
```

Should show 3 resumes stored.

---

### 4. Test Job Matching

#### Test 4A: Match Software Engineer Job

```bash
curl -X POST http://localhost:5000/api/match-job \
  -H "Content-Type: application/json" \
  -d '{
    "jobDescription": "Senior Software Engineer position. We are looking for a candidate with 5+ years of experience in Python and JavaScript. Experience with React, AWS, and Docker is required. Strong problem-solving skills and experience with databases like PostgreSQL."
  }'
```

**Expected Results**:
- `test_resume_1` should have highest similarity (~0.85-0.95)
- `test_resume_3` should have medium similarity (~0.65-0.75)
- `test_resume_2` should have lowest similarity (~0.40-0.50)

#### Test 4B: Match Data Science Job

```bash
curl -X POST http://localhost:5000/api/match-job \
  -H "Content-Type: application/json" \
  -d '{
    "jobDescription": "Data Scientist wanted. Must have strong Python and R skills. Experience with TensorFlow, machine learning, and statistical analysis required. 4+ years experience in data science or related field."
  }'
```

**Expected Results**:
- `test_resume_2` should have highest similarity (~0.85-0.95)
- `test_resume_1` should have medium similarity (~0.50-0.60)
- `test_resume_3` should have lowest similarity (~0.30-0.40)

#### Test 4C: Match DevOps Job

```bash
curl -X POST http://localhost:5000/api/match-job \
  -H "Content-Type: application/json" \
  -d '{
    "jobDescription": "DevOps Engineer needed. Expertise in Kubernetes, Docker, AWS, and CI/CD pipelines required. 6+ years infrastructure experience. Good knowledge of Infrastructure as Code with Terraform."
  }'
```

**Expected Results**:
- `test_resume_3` should have highest similarity (~0.85-0.95)
- `test_resume_1` should have medium similarity (~0.50-0.65)
- `test_resume_2` should have lowest similarity (~0.35-0.45)

---

### 5. Test Statistics Endpoint

```bash
curl http://localhost:5000/api/stats
```

**Expected Response**:
```json
{
  "total_resumes_stored": 3,
  "resumes": [
    {"id": "test_resume_1", "dimension": 1536},
    {"id": "test_resume_2", "dimension": 1536},
    {"id": "test_resume_3", "dimension": 1536}
  ]
}
```

---

### 6. Test Frontend UI

Open http://localhost:3000

**Test Steps**:
1. ✅ Check server status indicator shows "ONLINE" (should be green)
2. ✅ Upload form should display
3. ✅ Stats should show "Stored Resumes (3)"
4. ✅ Enter a job description
5. ✅ Click "Find Matches"
6. ✅ Verify results display with:
   - Match count
   - Resume IDs
   - Similarity bars
   - Scores as percentages

---

### 7. Test Error Handling

#### Test 7A: Empty Resume Text

```bash
curl -X POST http://localhost:5000/api/upload-resume \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test_error_1",
    "resumeText": ""
  }'
```

**Expected**: 400 error with message "Resume text cannot be empty"

#### Test 7B: Missing Resume ID

```bash
curl -X POST http://localhost:5000/api/upload-resume \
  -H "Content-Type: application/json" \
  -d '{
    "resumeText": "Some resume text"
  }'
```

**Expected**: 400 error with message about missing fields

#### Test 7C: Empty Job Description

```bash
curl -X POST http://localhost:5000/api/match-job \
  -H "Content-Type: application/json" \
  -d '{
    "jobDescription": ""
  }'
```

**Expected**: 400 error with message "Job description cannot be empty"

#### Test 7D: Missing JobDescription Field

```bash
curl -X POST http://localhost:5000/api/match-job \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected**: 400 error with message about missing fields

---

### 8. Test Clear Functionality

```bash
curl -X DELETE http://localhost:5000/api/clear
```

**Expected Response**:
```json
{"message": "All resumes cleared"}
```

**Verification**:
```bash
curl http://localhost:5000/api/stats
```

Should show 0 resumes stored.

---

### 9. Test Frontend Clear Button

1. Upload a resume using the frontend UI
2. Click "Delete All Resumes"
3. Confirm in the popup
4. Verify stats update to show 0 resumes

---

## Frontend UI Testing

### Visual Elements

- [ ] Header displays correctly
- [ ] Server status indicator visible
- [ ] Both text areas present
- [ ] Buttons are clickable and styled
- [ ] Results section appears after matching
- [ ] Error messages display in red
- [ ] Success messages display in green
- [ ] Loading states show spinners/text changes

### Responsive Design

Test on different screen sizes:

```bash
# Desktop: 1920x1080
# Tablet: 768x1024
# Mobile: 375x667
```

Verify:
- [ ] Layout adjusts properly
- [ ] Text is readable
- [ ] Buttons are tappable (>44px)
- [ ] No horizontal scrolling

---

## Performance Testing

### Load Test

Upload 10 resumes and match:

```bash
# Upload multiple resumes
for i in {1..10}; do
  curl -X POST http://localhost:5000/api/upload-resume \
    -H "Content-Type: application/json" \
    -d "{
      \"id\": \"resume_$i\",
      \"resumeText\": \"Resume text $i...\"
    }"
  sleep 0.5
done

# Match a job
curl -X POST http://localhost:5000/api/match-job \
  -H "Content-Type: application/json" \
  -d '{"jobDescription": "Job description..."}'
```

**Expected**:
- All requests complete successfully
- Response times < 5 seconds
- No memory leaks
- Consistent search results

### Latency Testing

Measure response times:

```bash
# Using 'time' command
time curl -X POST http://localhost:5000/api/upload-resume \
  -H "Content-Type: application/json" \
  -d '{"id": "test", "resumeText": "..."}'

# Using curl's built-in timing
curl -w "Total: %{time_total}s\n" http://localhost:5000/api/stats
```

**Expected**: < 2 seconds for embeddings, < 1 second for search

---

## Integration Testing

### Full Workflow Test

```bash
#!/bin/bash

echo "1. Clearing previous data..."
curl -X DELETE http://localhost:5000/api/clear

echo "2. Uploading 3 resumes..."
curl -X POST http://localhost:5000/api/upload-resume \
  -H "Content-Type: application/json" \
  -d '{"id": "dev1", "resumeText": "..."}'

echo "3. Getting stats..."
curl http://localhost:5000/api/stats

echo "4. Matching job..."
curl -X POST http://localhost:5000/api/match-job \
  -H "Content-Type: application/json" \
  -d '{"jobDescription": "..."}'

echo "5. Final stats..."
curl http://localhost:5000/api/stats
```

---

## Automated Testing

### Using Jest (Frontend)

```bash
cd frontend
npm test

# Run with coverage
npm test -- --coverage
```

### Using Jest (Backend)

```bash
cd backend
npm test
```

---

## Browser Testing

Test on multiple browsers:

- [ ] Chrome/Chromium (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Test Steps in Browser:

1. Open http://localhost:3000
2. Check console for errors (F12)
3. Test all features
4. Check Network tab for failed requests
5. Test responsiveness (F12 → Device mode)

---

## API Testing Tools

### Using Postman

1. Import endpoints from [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
2. Create test collection
3. Add pre-request scripts
4. Add test assertions
5. Run collection

### Using Insomnia

```bash
# Export collection and import into Insomnia
# Configure environment variables
# Run requests
```

---

## Load Testing with Apache Bench

```bash
# Install ab (comes with Apache)
# macOS: brew install httpd

# Benchmark health endpoint
ab -n 100 -c 10 http://localhost:5000/health

# Benchmark stats endpoint
ab -n 100 -c 10 http://localhost:5000/api/stats
```

---

## Memory/Resource Monitoring

### Monitor Backend

```bash
# In another terminal, monitor Node.js process
node --inspect server.js

# Open chrome://inspect in Chrome
```

### Monitor System (Linux/macOS)

```bash
watch -n 1 'ps aux | grep node'
```

---

## Checklist

### Pre-Launch Testing

- [ ] All endpoints return correct status codes
- [ ] Error messages are helpful
- [ ] UI is responsive
- [ ] No console errors
- [ ] No network errors
- [ ] Performance is acceptable
- [ ] Security checks pass
- [ ] All features work as expected

### Deployment Checklist

- [ ] Environment variables configured
- [ ] Error logging enabled
- [ ] HTTPS configured
- [ ] CORS properly set
- [ ] Rate limiting enabled
- [ ] Input validation active
- [ ] Database backups configured
- [ ] Monitoring alerts set

---

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd backend && npm install && npm test
      - run: cd frontend && npm install && npm test
```

---

**Last Updated**: March 2026
**Version**: 1.0.0
