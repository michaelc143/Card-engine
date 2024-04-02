import { useState } from 'react';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Login/Login';
import Registration from './components/Registration/Registration';
import FindGame from './components/FindGame/FindGame';
import CreateGame from './components/CreateGame/CreateGame';
import {ToastContainer, toast} from 'react-toastify';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function App() {
	const [loggedIn, setLoggedIn] = useState(false);
	const [username, setUsername] = useState('');
	const [regModalIsOpen, setRegModalIsOpen] = useState(false);
	const [findGameModalIsOpen, setfindGameModalIsOpen] = useState(false);
	const [createGameModalIsOpen, setCreateGameModalIsOpen] = useState(false);

	/**
	* @function
	* @description Opens the registration modal.
	*/
	const openRegModal = () => {
		setRegModalIsOpen(true);
	};
	
	/**
	* @function
	* @description Closes the registration modal.
	*/
	const closeRegModal = () => {
		setRegModalIsOpen(false);
	};

	/**
	* @function
	* @description Opens the findGame modal.
	*/
	const openfindGameModal = () => {
		setfindGameModalIsOpen(true);
	};
	
	/**
	* @function
	* @description Closes the findGame modal.
	*/
	const closefindGameModal = () => {
		setfindGameModalIsOpen(false);
	};

	/**
	* @function
	* @description Opens the createGame modal.
	*/
	const openCreateGameModal = () => {
		setCreateGameModalIsOpen(true);
	};
	
	/**
	* @function
	* @description Closes the createGame modal.
	*/
	const closeCreateGameModal = () => {
		setCreateGameModalIsOpen(false);
	};

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
						showToast('User does not exist with that name', 'error');
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
						showToast(`Successfully registered ${username}`, 'success');
						closeRegModal();
						} 
					else if (data === 'User already exists') {
						alert('Username already taken');
						showToast('Username already taken', 'error');
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
				<>
					<p>Welcome {username}!</p>
					<button onClick={openfindGameModal}>
						Find Game
					</button>
					<Modal // Find Game modal popup
						isOpen={findGameModalIsOpen}
						onRequestClose={closefindGameModal}
						contentLabel="Registration Modal"
						style={{
							overlay: {
								backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
							},
							content: {
								width: '600px', // Set the desired width
								height: '500px', // Set the desired height
								margin: 'auto', // Center the modal vertically and horizontally
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center', // Center the content horizontally
								justifyContent: 'center', // Center the content vertically
								borderRadius: '10px', // Add this line to round the edges
							},
						}}
					>
						<FindGame
							showToast={showToast}
							closeModal={closefindGameModal}
						/>
					</Modal>
					<button onClick={openCreateGameModal}>
						Create Game
					</button>
					<Modal //create game modal popup
						isOpen={createGameModalIsOpen}
						onRequestClose={closeCreateGameModal}
						contentLabel="Registration Modal"
						style={{
							overlay: {
								backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
							},
							content: {
								width: '600px', // Set the desired width
								height: '500px', // Set the desired height
								margin: 'auto', // Center the modal vertically and horizontally
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center', // Center the content horizontally
								justifyContent: 'center', // Center the content vertically
								borderRadius: '10px', // Add this line to round the edges
							},
						}}
					>
						<CreateGame
							showToast={showToast}
							closeModal={closeCreateGameModal}
						/>
					</Modal>
				</>
			) 
			: 
			( //User not logged in yet, prompt with login and option to register
			<>
				<Login
					onLogin={handleLogin}
					openModal={openRegModal}
					showToast={showToast}
				/>
				<Modal
					isOpen={regModalIsOpen}
					onRequestClose={closeRegModal}
					contentLabel="Registration Modal"
					style={{
						overlay: {
							backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
						},
						content: {
							width: '400px', // Set the desired width
							height: '300px', // Set the desired height
							margin: 'auto', // Center the modal vertically and horizontally
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center', // Center the content horizontally
							justifyContent: 'center', // Center the content vertically
							borderRadius: '10px', // Add this line to round the edges
						},
					}}
				>
					<Registration
						onRegister={handleRegister}
						showToast={showToast}
						closeModal={closeRegModal}
					/>
				</Modal>
			</>
			)
		}
		</div>
	);
}

export default App;
