import { useState } from 'react';
import './Login.css';

function Login({ onLogin, showToast, openModal }) {

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

	/**
	* Renders the login form for user authentication.
	* 
	* @prop {string} username - The current username entered in the form.
	* @prop {function} setUsername - Function to update the username state.
	* @prop {function} handleLogin - Function to handle user login attempt.
	* @prop {function} openModal - Function to open the registration modal as passed down as a prop from App.jsx.
	*/
	return (
		<div className="login-box" data-testid="login-box">
			<h2 className='home'>Login:</h2>
			<div style={{display: 'flex'}}>
				<input
					className='input-box textfield'
					type="text"
					placeholder="Username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
				<button className="login-btn" onClick={handleLogin}>
					&gt;
				</button>
			</div>
			<h2 className='home'>New?</h2>
			<button className="sign-up" onClick={openModal}>
				Sign up
			</button>
		</div>
	);
}

export default Login;