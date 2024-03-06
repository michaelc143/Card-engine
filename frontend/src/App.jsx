import { useState } from 'react';
import './App.css';
import Login from './components/Login/Login';
import Registration from './components/Registration/Registration';

function App() {
	const [loggedIn, setLoggedIn] = useState(false);
	const [username, setUsername] = useState('');
	const [isRegistering, setIsRegistering] = useState(false);

	const handleLogin = (username, isLogged) => {
		setUsername(username);
		setLoggedIn(isLogged);
	};

	const handleRegister = (username, isLogged) => {
		alert(`Successfully registered ${username}!`);
		setUsername(username);
		setIsRegistering(false);
	};

	const handleToggleMode = () => {
		setIsRegistering(!isRegistering);
	};

	return (
		<div className="container">
		<h1>Welcome to Card Engine!</h1>
		{
			loggedIn 
			?
			
			( // Once we have components for the game/lobby, they go in this area
				<p>Welcome {username}!</p>
			) 
			: 
			( //User not logged in yet, prompt with login and option to register
				<>
				<p>Doesn't seem like you're logged in!</p>
				{isRegistering ? (
					<Registration onRegister={handleRegister} />
				) : (
					<Login onLogin={handleLogin} />
				)}
				<button className="toggle-btn" onClick={handleToggleMode}>
					{
						isRegistering
						? 
						'Already have a login? Login Here'
						: 
						'New player? Register Here'
					}
				</button>
				</>
			)
		}
		</div>
	);
}

export default App;