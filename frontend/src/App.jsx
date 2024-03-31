import { useState } from 'react';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Login/Login';
import Registration from './components/Registration/Registration';
import {ToastContainer, toast} from 'react-toastify';

function App() {
	const [loggedIn, setLoggedIn] = useState(false);
	const [username, setUsername] = useState('');
	const [isRegistering, setIsRegistering] = useState(false);

	/**
	* @function
	* @description Handles the user login process. It stores the username in the username state variable and sets loggedIn to true to communicate that the user is logged in.
	* @param {string} username - The username entered by the user.
	*/
	const handleLogin = (username) => {
		fetch(`http://localhost:8080/login?username=${username}`, {method: 'POST',})
			.then(response => response.text())
				.then(data => {
					console.log(data); // Used in development to debug
					if (data === 'Logged in') {
						setUsername(username);
						setLoggedIn(true);
					} 
					else {
						alert('User does not exist with that name');
					}
				})
			.catch(error => {
				console.error('Error:', error);
		});
	};

	/**
	* @function
	* @description Handles the user registration process. It alerts the user that they have successfully registered, sets their username to what they indicated, and switches the component shown from Registration to Login.
	* @param {string} username - The username entered by the user.
	*/
	const handleRegister = (username) => {
		fetch(`http://localhost:8080/register?username=${username}`, {method: 'POST',})
			.then(response => response.text())
				.then(data => {
					console.log(data); // Used in development to debug
					if (data === 'User successfully registered') {
						setUsername(username);
						alert(`Successfully registered ${username}`);
						setIsRegistering(false);
						} 
					else if (data === 'User already exists') {
						alert('Username already taken');
					}
					else {
						throw new Error(data);
					}
				})
				.catch(error => {
					console.error('Error:', error);
		});
	};

	/**
	* @function
	* @description Toggles the mode between login and registration component.
	*/
	const handleToggleMode = () => {
		setIsRegistering(!isRegistering);
	};

	/**
	* @function
	* @description Displays a toast message based on the provided type.
	* @param {string} message - The message to be displayed in the toast.
	* @param {('success'|'info'|'warn'|'error')} type - The type of toast message to be displayed.
	*/
	const showToast = (message, type) => {
		toast[type](message);
	}

	return (
		<div className="container">
		<ToastContainer 
			limit={5}
			stacked={true}
		/>
		<h1>Eucre</h1>
		{
			loggedIn 
			?
			
			( // Once we have components for the game/lobby, they go in this area
				<p>Welcome {username}!</p>
			) 
			: 
			( //User not logged in yet, prompt with login and option to register
				<>
				{isRegistering ? (
					<Registration 
						onRegister={handleRegister}
						handleToggleMode={handleToggleMode}
						showToast={showToast}
					/>
				) : (
					<Login
						onLogin={handleLogin}
						handleToggleMode={handleToggleMode}
						showToast={showToast}
					/>
				)}
				</>
			)
		}
		</div>
	);
}

export default App;
