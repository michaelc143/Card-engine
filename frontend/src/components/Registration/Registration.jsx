import React, { useState } from 'react';
import './Registration.css';

function Registration({ onRegister, handleToggleMode, showToast }) {
    const [username, setUsername] = useState('');

    /**
    * Handles the registration process.
    * @function
    * @description Checks if the user has inputted a username. If a username is provided, it sends the username to the parent component to run the `handleRegistration` function. If no username is entered, it displays an error toast.
    * @param {string} [username] - The username entered by the user.
    * @param {function} onRegister - The function to be called in the parent component with the provided username.
    * @param {function} showToast - The function to display a toast message.
    */
    const handleRegister = () => {
        if (username) {
            onRegister(username);
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