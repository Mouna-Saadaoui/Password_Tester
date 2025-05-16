import { useState } from 'react';
import axios from 'axios';

function App() {
  const [password, setPassword] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/evaluate', {
        password,
        want_suggestion: true  // Optional: frontend decides if it wants a suggestion
      });
      setResult(res.data);
    } catch (error) {
      console.error('Error evaluating password:', error);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Password Strength Checker 🔐</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          style={{ padding: '0.5rem', fontSize: '1rem', width: '300px' }}
        />
        <button type="submit" style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}>
          Check
        </button>
      </form>

      {result && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Results:</h2>
          <p><strong>Strength:</strong> {result.feedback.strength}</p>
          <p><strong>Strength Level:</strong> {result.feedback.strength_level}</p>
          <p><strong>Color Code:</strong> {result.feedback.color}</p>

          {result.feedback.feedback?.length > 0 && (
            <div>
              <strong>Tips:</strong>
              <ul>
                {result.feedback.feedback.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {result.suggestion && (
            <p><strong>Suggested Strong Password:</strong> {result.suggestion}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
