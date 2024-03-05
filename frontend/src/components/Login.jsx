import React, { useState } from "react";
import '../styles/Login.css'

function Login({ onLogin, onRegister }) {
    const [username, setUsername] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
  
    const handleLogin = () => {
      // Perform your login logic here (e.g., API call, authentication)
      // For simplicity, let's just check if username is not empty
      if (username) {
        onLogin(username, true);
      } else {
        alert('Please enter username');
      }
    };

    const handleToggleMode = () => {
      setIsRegistering(!isRegistering);
    };

    const handleRegister = () => {
      // Perform your registration logic here
      // For now just doing the same as logging in
      if (username) {
        onRegister(username, true); //passes the username and login back to parent component
        handleToggleMode(); //used to switch back to login mode
      } else {
        alert('Please enter username');
      }
    };
  
    return (
      <div className="login-box">
        <h2>{isRegistering ? 'Register' : 'Login'}</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {isRegistering ? (
          <button className='register-btn' onClick={handleRegister}>Register</button>
        ) : (
          <button className='login-btn' onClick={handleLogin}>Login</button>
        )}
        <button className='toggle-btn' onClick={handleToggleMode}>
          {isRegistering ? 'Already have a login? Login Here' : 'New player? Register Here'}
        </button>
      </div>
    );
}

export default Login;
