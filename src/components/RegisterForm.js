import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import bgImage from "../media/alex-wigan-hKbmictIYDM-unsplash.jpg";

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isBusinessOwner, setIsBusinessOwner] = useState(false);
  const [error, setError] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');
  const [serverOtp, setServerOtp] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const role = isBusinessOwner ? "businessOwner" : "user";
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users/register`, { name, email, password, role });
      setServerOtp(response.data.otp);
      setShowOtpInput(true);
    } catch (err) {
      setError('Registration failed');
    }
  };

  const handleOtpVerification = (e) => {
    e.preventDefault();
    if (otp === serverOtp) {
      alert('Registration successful');
      navigate('/login');
    } else {
      setError('Invalid OTP');
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: "center",
      justifyContent: 'center',
      width: '100%',
      height: "100vh",
      backgroundImage: `url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
      }}></div>

      <div style={{
        padding: '20px',
        width: '100%',
        maxWidth: '400px',
        margin: 'auto',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        zIndex: 1,
      }}>
        <h2 style={{ textAlign: 'center', color: '#333' }}>Register</h2>
        {!showOtpInput ? (
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                }}
              />
            </div>
            <div className="mb-3 form-check" style={{ display: 'flex', alignItems: "center" }}>
              <input
                type="checkbox"
                className="form-check-input"
                id="businessOwner"
                checked={isBusinessOwner}
                onChange={(e) => setIsBusinessOwner(e.target.checked)}
                style={{
                  margin: '0 10px',
                }}
              />
              <label className="form-check-label" htmlFor="businessOwner">Register as Business Owner</label>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '10px', borderRadius: '5px', backgroundColor: '#007bff', border: 'none' }}>Register</button>
          </form>
        ) : (
          <form onSubmit={handleOtpVerification}>
            <div className="mb-3">
              <label htmlFor="otp" className="form-label">Enter OTP</label>
              <input
                type="text"
                className="form-control"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                style={{
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                }}
              />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '10px', borderRadius: '5px', backgroundColor: '#007bff', border: 'none' }}>Verify OTP</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterForm;