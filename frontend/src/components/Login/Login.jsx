import React, { useState } from 'react';
import './Login.css';

function Login({ onLogin, handleToggleMode, showToast }) {
	const [username, setUsername] = useState('');

	const handleLogin = () => {
		// Checks if the user has inputted a username
		// If username there, sends username to the parent component to run handleLogin in parent component
		// Alerts user if no username entered
		if (username) {
			onLogin(username, true);
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