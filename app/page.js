'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
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
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.details || data.error?.message || data.error || 'API error');
      }
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      const parsed = text.split(/\n|\r/)
        .map(line => line.trim())
        .filter(line => /^\d+[\.\)]/.test(line))
        .map(line => line.replace(/^\d+[\.\)]\s*/, '').replace(/[\*\"]/g, '').trim());
      
      if (parsed.length > 0) {
        setQuestions(parsed);
      } else if (text.trim() !== '') {
        const fallback = text.split(/\n\n/).map(q => q.replace(/[\*\"]/g, '').trim()).filter(q => q.length > 10);
        setQuestions(fallback.length > 0 ? fallback.slice(0, 3) : [text.trim()]);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch questions. Please try again.');
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
    <div className={styles.appContainer}>
      <header className={styles.header}>
        <div className={styles.logo}>InterviewGen.ai</div>
      </header>

      <main>
        <section className={styles.hero}>
          <h1>Master Your Next Interview</h1>
          <p>Generate intelligent, position-specific interview questions in seconds with our AI-powered engine.</p>
          
          <div className={styles.glassContainer}>
            <form className={styles.searchForm} onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  className={styles.modernInput}
                  value={jobTitle}
                  onChange={e => setJobTitle(e.target.value)}
                  placeholder="Enter job title (e.g. Senior Product Manager)"
                  required
                />
              </div>
              <button className={styles.generateBtn} type="submit" disabled={loading}>
                {loading ? <div className={styles.loader} /> : 'Generate Questions'}
              </button>
            </form>
            {error && <div className={styles.modernError} style={{marginTop: 20, color: '#ef4444'}}>{error}</div>}
          </div>
        </section>

        {questions.length > 0 && (
          <section className={styles.resultsSection}>
            <div className={styles.resultsGrid}>
              {questions.map((q, i) => (
                <div key={i} className={styles.questionCard}>
                  <div className={styles.questionText}>"{q}"</div>
                  <button 
                    className={styles.copyBtn} 
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
        Built with ❤️ by Julius • Powered by Google Gemini
      </footer>
    </div>
  );
}
