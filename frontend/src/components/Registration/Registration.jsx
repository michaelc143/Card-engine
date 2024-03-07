import React, { useState } from 'react';
import './Registration.css';

function Registration({ onRegister }) {
    const [username, setUsername] = useState('');

    const handleRegister = () => {
        // Checks if the user has inputted a username
		// If username there, sends username to the parent component to run handleRegistration in parent component
		// Alerts user if no username entered
        if (username) {
            onRegister(username, true);
        } 
        else {
            alert('Please enter username');
        }
    };

    return (
        <div className="registration-box">
            <h2>Register</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <button className="register-btn" onClick={handleRegister}>
            Register
            </button>
        </div>
    );
}

export default Registration;