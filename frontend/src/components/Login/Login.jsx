import React, { useState } from 'react';
import './Login.css';

function Login({ onLogin }) {
	const [username, setUsername] = useState('');

	const handleLogin = () => {
		// Checks if the user has inputted a username
		// If username there, sends username to the parent component to run handleLogin in parent component
		// Alerts user if no username entered
		if (username) {
			onLogin(username, true);
		} 
		else {
			alert('Please enter username');
		}
	};

	return (
		<div className="login-box" data-testid="login-box">
			<h2>Login</h2>
			<input
				type="text"
				placeholder="Username"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
			/>
			<button className="login-btn" onClick={handleLogin}>
			Login
			</button>
		</div>
	);
}

export default Login;