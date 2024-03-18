import React, { useState } from 'react';
import './Login.css';

function Login({ onLogin, handleToggleMode }) {
	const [username, setUsername] = useState('');
	const [isRegistering, setIsRegistering] = useState(false);

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
			<h2>Login:</h2>
			<input
				className='login-input'
				type="text"
				placeholder="Username"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
			/>
			<button className="login-btn" onClick={handleLogin}>
			Login
			</button>
			<button className="toggle-btn" onClick={handleToggleMode}>
				{isRegistering ? 'Already have a login? Login Here' : 'New player? Register Here'}
			</button>
		</div>
	);
}

export default Login;