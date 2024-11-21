
import { signIn } from 'next-auth/react';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGoogle } from '@fortawesome/free-brands-svg-icons';
export default function Home() {

    const handleLogin = (provider) => {
        signIn(provider, { callbackUrl: '/dashboard' });
      };
    
  return (
    <div className="container">
      <div className="form-container">
        <h1 className="title">Welcome Back!</h1>
        <p className="subtitle">Please sign in to your account.</p>

        {/* Google Login Button */}
        <button className="google-button" onClick={() => handleLogin('google')}>
          <FontAwesomeIcon icon={faGoogle} className="icon" />
          Sign in with Google
        </button>

        {/* LinkedIn Login Button */}
        <button className="linkedin-button" onClick={() => handleLogin('linkedin')}>
          <FontAwesomeIcon icon={faLinkedin} className="icon" />
          Sign in with LinkedIn
        </button>
        <button className="linkedin-button" style={{backgroundColor:"#a6ce39 !important"}} onClick={() => handleLogin('orcid')}>
          <FontAwesomeIcon icon={faLinkedin} className="icon" />
          Sign in with ORCID
        </button>

        <div className="separator">
          <span>or</span>
        </div>

        {/* Traditional Login Form */}
        <form className="form" action="/dashboard" method="POST">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input"
            required
          />
          <button type="submit" className="submit-button">
            Sign In
          </button>
        </form>

        <p className="forgot-password">Forgot your password?</p>
      </div>
    </div>
  );
};
