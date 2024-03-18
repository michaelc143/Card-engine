import React, { useState } from 'react';
import './Registration.css';

function Registration({ onRegister, handleToggleMode }) {
    const [username, setUsername] = useState('');
    const [isRegistering, setIsRegistering] = useState(true);

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
        <div className="registration-box" data-testid="registration-box">
            <h2>Register:</h2>
            <input
                className='register-input'
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <button className="register-btn" onClick={handleRegister}>
            Register
            </button>
            <button className="toggle-btn" onClick={handleToggleMode}>
				{isRegistering ? 'Already have a login? Login Here' : 'New player? Register Here'}
			</button>
        </div>
    );
}

export default Registration;