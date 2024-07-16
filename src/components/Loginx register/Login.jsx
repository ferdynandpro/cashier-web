import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './auth.css'; // Import the CSS file

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:5001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate('/admin/dashboard/dashboard');
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="auth--container">

    <div className="auth-container">
      <h2 className='titles'>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className='input--div'>
          <label>Username:</label>
          <input
            className='login--input'
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            />
        </div>
        <div className='input--div'>
          <label>Password:</label>
          <input
          className='pass--input'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
        </div>
        {error && <p>{error}</p>}
        <button type="submit">Login</button>
      </form>
      <div className="link">
        <a href="/register">Don't have an account? Register here</a>
      </div>
    </div>
            </div>
  );
};

export default Login;
