import React, { useState } from 'react';
import './Login.css';

function Login({ onLogin, handleToggleMode, showToast }) {
	const [username, setUsername] = useState('');

	/**
	* Handles the login process.
	* @function
	* @description Checks if the user has inputted a username. If a username is provided, it sends the username to the parent component to run the `handleLogin` function. If no username is entered, it displays an error toast.
	* @param {string} [username] - The username entered by the user.
	* @param {function} onLogin - The function to be called in the parent component with the provided username.
	* @param {function} showToast - The function to display a toast message.
	*/
	const handleLogin = () => {
		if (username) {
			onLogin(username);
		} 
		else {
			showToast('Username not specified for login', 'error');
		}
	};

	return (
		<div className="login-box" data-testid="login-box">
			<h2 className='login-h2'>Login:</h2>
			<input
				className='login-input'
				type="text"
				placeholder="Username"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
			/>
			<button className="login-btn" onClick={handleLogin}>
				&gt;
			</button>
			<h2 className='new-player-h2'>New?</h2>
			<button className="toggle-btn" onClick={handleToggleMode}>
				Sign up
			</button>
		</div>
	);
}

export default Login;