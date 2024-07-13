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
      const response = await fetch('https://back-end-cashier-api.vercel.app/login', {
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

  const handleWewButtonClick = async () => {
    try {
      const response = await fetch('https://back-end-cashier-api.vercel.app/your-endpoint', {
        method: 'POST', // or 'GET' or any other method that suits your backend
        headers: {
          'Content-Type': 'application/json',
        },
        // Add any data you want to send to the backend
        body: JSON.stringify({ exampleData: 'exampleValue' }),
      });

      const data = await response.json();
      // Handle response from backend if needed
      console.log(data);
    } catch (error) {
      console.error('Error:', error);
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
        <button onClick={handleWewButtonClick}>wew</button>
        <div className="link">
          <a href="/register">Don't have an account? Register here</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
