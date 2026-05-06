import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

function App() {
  const [resume, setResume] = useState("");
  const [resumeId, setResumeId] = useState("");
  const [job, setJob] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState("checking");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [storedResumes, setStoredResumes] = useState([]);

  // Check server health on component mount
  useEffect(() => {
    checkServerHealth();
  }, []);

  const checkServerHealth = async () => {
    try {
      const response = await axios.get(`${API_URL}/stats`);
      if (response.data.status === 'endee_offline') {
        setServerStatus('warning'); // Backend up, but Endee offline
      } else {
        setServerStatus("online");
      }
      setStoredResumes(response.data.resumes || []);
    } catch (err) {
      setServerStatus("offline");
      console.error("Server health check failed:", err.message);
    }
  };

  const handleUploadResume = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!resume.trim()) {
      setError("Please enter resume text");
      return;
    }

    if (!resumeId.trim()) {
      setError("Please enter a resume ID");
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${API_URL}/upload-resume`, {
        id: resumeId,
        resumeText: resume,
      });

      setSuccessMessage(`Resume "${resumeId}" stored successfully!`);
      setResume("");
      setResumeId("");
      checkServerHealth(); // Refresh stats
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      setError(`Failed to upload resume: ${errorMsg}`);
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMatchJob = async (e) => {
    e.preventDefault();
    setError("");
    setResults(null);

    if (!job.trim()) {
      setError("Please enter job description");
      return;
    }

    if (storedResumes.length === 0) {
      setError("No resumes stored yet. Please upload at least one resume first.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/match-job`, {
        jobDescription: job,
      });

      setResults(response.data);
      setSuccessMessage("Job matching completed!");
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      setError(`Failed to match job: ${errorMsg}`);
      console.error("Match error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete all resumes? This cannot be undone."
      )
    ) {
      setLoading(true);
      try {
        await axios.delete(`${API_URL}/clear`);
        setSuccessMessage("All resumes cleared!");
        setResults(null);
        checkServerHealth();
      } catch (err) {
        setError("Failed to clear resumes: " + (err.response?.data?.error || err.message));
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🤖 AI Resume Matcher</h1>
        <p className="subtitle">
          Find the best resume match for your job description
        </p>
        <div className={`server-status status-${serverStatus}`}>
          <span className="status-dot"></span>
          Server: <strong>{serverStatus.toUpperCase()}</strong>
        </div>
      </header>

      <main className="app-main">
        {/* Server Status */}
        {serverStatus === "offline" && (
          <div className="alert alert-error">
            ⚠️ Backend server is not available. Please start the backend server.
          </div>
        )}

        {/* Messages */}
        {error && <div className="alert alert-error">{error}</div>}
        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        )}

        <div className="container">
          {/* Resume Upload Section */}
          <section className="section">
            <h2>📄 Upload Resume</h2>
            <form onSubmit={handleUploadResume}>
              <div className="form-group">
                <label htmlFor="resume-id">Resume ID (unique identifier):</label>
                <input
                  id="resume-id"
                  type="text"
                  placeholder="e.g., john_doe_engineer"
                  value={resumeId}
                  onChange={(e) => setResumeId(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="resume">Resume Text:</label>
                <textarea
                  id="resume"
                  rows="8"
                  placeholder="Paste your resume text here..."
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading || serverStatus === "offline"}
                className="btn btn-primary"
              >
                {loading ? "Uploading..." : "Upload Resume"}
              </button>
            </form>

            {/* Stored Resumes Info */}
            {storedResumes.length > 0 && (
              <div className="info-box">
                <h4>Stored Resumes ({storedResumes.length}):</h4>
                <ul>
                  {storedResumes.map((r) => (
                    <li key={r.id}>
                      <strong>{r.id}</strong> - Dimension: {r.dimension}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* Job Matching Section */}
          <section className="section">
            <h2>💼 Match Job Description</h2>
            <form onSubmit={handleMatchJob}>
              <div className="form-group">
                <label htmlFor="job">Job Description:</label>
                <textarea
                  id="job"
                  rows="8"
                  placeholder="Paste the job description here..."
                  value={job}
                  onChange={(e) => setJob(e.target.value)}
                  disabled={loading || serverStatus === "offline"}
                />
              </div>

              <button
                type="submit"
                disabled={loading || serverStatus === "offline" || storedResumes.length === 0}
                className="btn btn-primary"
              >
                {loading ? "Matching..." : "Find Matches"}
              </button>
            </form>
          </section>

          {/* Results Section */}
          {results && (
            <section className="section results-section">
              <h2>📊 Matching Results</h2>
              <div className="results-info">
                <p>
                  <strong>Matches Found:</strong>{" "}
                  {results.matches_found || results.results?.length || 0}
                </p>
                <p className="text-muted">
                  {results.job_description_preview}
                </p>
              </div>

              {results.results && results.results.length > 0 ? (
                <div className="results-list">
                  {results.results.map((result, index) => (
                    <div key={result.id || index} className="result-item">
                      <div className="result-rank">#{index + 1}</div>
                      <div className="result-content">
                        <h4>{result.id}</h4>
                        <div className="similarity-bar">
                          <div
                            className="similarity-fill"
                            style={{
                              width: `${(result.similarity * 100).toFixed(1)}%`,
                            }}
                          ></div>
                        </div>
                        <p className="similarity-score">
                          Match Score: {(result.similarity * 100).toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No matching resumes found.</p>
              )}
            </section>
          )}

          {/* Clear All Button */}
          {storedResumes.length > 0 && (
            <section className="section">
              <button
                onClick={handleClearAll}
                disabled={loading}
                className="btn btn-danger"
              >
                Delete All Resumes
              </button>
            </section>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>
          AI Resume Matcher | Powered by OpenAI Embeddings & Endee Vector Database
        </p>
      </footer>
    </div>
  );
}

export default App;