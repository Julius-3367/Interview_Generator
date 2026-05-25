import { useState } from 'react';
import './App.css';

const GEMINI_API_URL = "http://localhost:5174/api/generate";

function App() {
  const [jobTitle, setJobTitle] = useState('Customer Success Manager');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const prompt = `Generate 3 professional interview questions for a ${jobTitle}. 
      Format: 
      1. [Question 1]
      2. [Question 2]
      3. [Question 3]
      Return ONLY the numbered list. No intro, no outro, no markdown bolding.`;
      
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
      if (!response.ok) throw new Error('API error');
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      // Improved robust parsing
      const parsed = text.split(/\n|\r/)
        .map(line => line.trim())
        .filter(line => /^\d+[\.\)]/.test(line)) // Matches "1." or "1)"
        .map(line => line.replace(/^\d+[\.\)]\s*/, '').replace(/[\*\"]/g, '').trim());
      
      if (parsed.length > 0) {
        setQuestions(parsed);
      } else if (text.trim() !== '') {
        // Fallback: split by double newlines if no numbered list found
        const fallback = text.split(/\n\n/).map(q => q.replace(/[\*\"]/g, '').trim()).filter(q => q.length > 10);
        setQuestions(fallback.length > 0 ? fallback.slice(0, 3) : [text.trim()]);
      }
    } catch {
      setError('Failed to fetch questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo">InterviewGen.ai</div>
      </header>

      <main>
        <section className="hero">
          <h1>Master Your Next Interview</h1>
          <p>Generate intelligent, position-specific interview questions in seconds with our AI-powered engine.</p>
          
          <div className="glass-container">
            <form className="search-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="text"
                  className="modern-input"
                  value={jobTitle}
                  onChange={e => setJobTitle(e.target.value)}
                  placeholder="Enter job title (e.g. Senior Product Manager)"
                  required
                />
              </div>
              <button className="generate-btn" type="submit" disabled={loading}>
                {loading ? <div className="loader" /> : 'Generate Questions'}
              </button>
            </form>
            {error && <div className="modern-error" style={{marginTop: 20, color: '#ef4444'}}>{error}</div>}
          </div>
        </section>

        {questions.length > 0 && (
          <section className="results-section">
            <div className="results-grid">
              {questions.map((q, i) => (
                <div key={i} className="question-card">
                  <div className="question-text">"{q}"</div>
                  <button 
                    className="copy-btn" 
                    onClick={() => copyToClipboard(q, i)}
                  >
                    {copiedIndex === i ? 'Copied!' : 'Copy Question'}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer style={{textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)', fontSize: '0.875rem'}}>
        &copy; {new Date().getFullYear()} InterviewGen.ai • Powered by Google Gemini
      </footer>
    </div>
  );
}

export default App;
