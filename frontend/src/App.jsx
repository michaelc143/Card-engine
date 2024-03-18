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

	const handleLogin = (username, isLogged) => {
		// This function is used to signify when a user is logged in. It stores the username in the username
		// state variable and sets loggedIn to true to communicate that the user is logged in.
		fetch(`http://localhost:8080/login?username=${username}`, {method: 'POST',})
			.then(response => response.text())
				.then(data => {
					console.log(data); // Used in development to debug
					if (data === 'Logged in') {
						setUsername(username);
						setLoggedIn(isLogged);
					} 
					else {
						alert('User does not exist with that name');
					}
				})
			.catch(error => {
				console.error('Error:', error);
		});
	};

	const handleRegister = (username, isLogged) => {
		// This function serves as a way of registering a new user to the application. It alerts the user
		// that they have successfully registered, sets their username to what they indicated, and
		// switches the component shown from Registration to Login.
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

	const handleToggleMode = () => {
		// Toggle between login and registration component
		setIsRegistering(!isRegistering);
	};

	const showToast = (message, type) => {
		// Toast function based on type (success, info, warn, error), used to display toast messages
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
