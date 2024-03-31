import React, { useState } from 'react';
import './Registration.css';

function Registration({ onRegister, handleToggleMode, showToast }) {
    const [username, setUsername] = useState('');

    const handleRegister = () => {
        // Checks if the user has inputted a username
		// If username there, sends username to the parent component to run handleRegistration in parent component
		// Alerts user if no username entered
        if (username) {
            onRegister(username, true);
        } 
        else {
            showToast('Username not specified for registration', 'error');
        }
    };

    return (
        <div className="registration-box" data-testid="registration-box">
            <h2 className='register-h2'>Register:</h2>
            <input
                className='register-input'
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <button className="register-btn" onClick={handleRegister}>
                &gt;
            </button>
            <button className="toggle-btn" onClick={handleToggleMode}>
				Already have a login?
			</button>
        </div>
    );
}

export default Registration;