import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './auth.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('https://back-end-cashier.vercel.app/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/login');
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p>{error}</p>}
        <button type="submit">Register</button>
      </form>
      <div className="link">
        <a href="/login">Already have an account? Login here</a>
      </div>
    </div>
  );
};

export default Register;
