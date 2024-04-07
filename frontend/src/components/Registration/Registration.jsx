import React, { useState } from 'react';
import './Registration.css';
import closeModalBtn from '../../assets/close.svg';

function Registration({ onRegister, showToast, closeModal }) {
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
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <h2 className='home'>Register:</h2>
                <button style={{height: '4rem'}} onClick={closeModal}>
                    <img src={closeModalBtn} alt="Close" />
                </button>
            </div>
            <div style={{display: 'flex'}}>
                <input
                    className='input-box textfield'
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <button className="register-btn" onClick={handleRegister}>
                    &gt;
                </button>
            </div>
        </div>
    );
}

export default Registration;