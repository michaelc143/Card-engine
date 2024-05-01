import { useContext, useState } from 'react';
import './CreateGame.css';
import closeModalBtn from '../../assets/close.svg';
import arrowSVG from '../../assets/return-arrow.svg';
import notifSVG from '../../assets/notif-icon.svg';
import { UserContext } from '../../contexts/UserContext';

function CreateGame({ closeModal, openLobbyScreenModal, showToast, setSelectedGameId }) {

	const { user } = useContext(UserContext);
	const [gameName, setGameName] = useState('');
	const [isPrivate, setIsPrivate] = useState(false);
	const [password, setPassword] = useState('');
	const [maxPlayers, setMaxPlayers] = useState(1);

	const handleGameNameChange = (e) => setGameName(e.target.value);
	const handlePrivateToggle = () => setIsPrivate(!isPrivate);
	const handlePasswordChange = (e) => setPassword(e.target.value);
	const handleMaxPlayersChange = (e) => setMaxPlayers(parseInt(e.target.value));


	// verifies that there is a game name entered
	// then opens the lobby modal
	const closeModalAndCreateGame = () => {

		if (!gameName) {
			showToast('Game name is required', 'error');
		}

		else {
			// send newly created game to the backend using gameName
			fetch(`http://localhost:8080/games/euchre/create-game?playerID=${user.user_id}&gameName=${gameName}`, {method: 'POST',})
			.then(response => response.text())
				.then(data => {
					console.log(data); // Used in development to debug
					if (data === 'Game could not be created') {
						showToast("Couldn't create game", 'error');
					}
					else {
						setSelectedGameId(data);
						showToast("Created game", 'success');
					}
				})
			.catch(error => {
				console.error('Error:', error);
			});
			closeModal();
			openLobbyScreenModal();
		}
	}

	/**
	* CreateGame representing the UI for creating a new game.
	* 
	* @prop {string} closeModalBtn - The image source for the close button.
	* @prop {function} closeModal - A function to close the "Create Game" modal.
	* @prop {string} gameName - The current game name.
	* @prop {function} handleGameNameChange - Function to handle changes in the game name input.
	* @prop {boolean} isPrivate - A state variable indicating if the game is private.
	* @prop {function} handlePrivateToggle - Function to handle toggling the private game checkbox.
	* @prop {string} password - The password for a private game.
	* @prop {function} handlePasswordChange - Function to handle changes in the password input.
	* @prop {number} maxPlayers - The selected maximum number of human players.
	* @prop {function} handleMaxPlayersChange - Function to handle changes in the max players dropdown.
	* @prop {function} closeModalAndCreateGame - Function to close the modal and create the new game.
	*/
	return (
		<>
			<div className='create-game'>
				<div className='upper-bar'>
					<h2 style={{marginLeft: '1rem'}} className='menu-header'>Create Game.</h2>
					<img className='closeModalX' src={closeModalBtn} onClick={closeModal} alt='close'/>
				</div>
				<div className='setup'>
					<h3 className='setup-title'>Setup:</h3>
					<label>
						Name: <input type="text" className='input-box textfield' placeholder='Name' value={gameName} onChange={handleGameNameChange} required /> <text style={{color: 'red', fontStyle: 'italic'}}>required.</text>
					</label>
					{/* TODO: add this to req to backend to make game private in db */}
					<div>
						Private:
						<input type="checkbox" checked={isPrivate} onChange={handlePrivateToggle} />
					</div>
					
					{isPrivate && ( // Only displays password input if the user clicks the private checkbox
						<label>
						<img src={arrowSVG}/> Password: <input type="password" className='input-box textfield' placeholder='Password' value={password} onChange={handlePasswordChange} />
						</label>
					)}
					<label>
						{/* TODO: Add this to req to backend so that the num bots can be used in db */}
						Max human players:
						<select value={maxPlayers} onChange={handleMaxPlayersChange}>
						<option value={1}>1</option>
						<option value={2}>2</option>
						<option value={3}>3</option>
						<option value={4}>4</option>
						</select>
					</label>
					<div style={{display: 'flex', justifyContent: 'space-between', marginTop: '1rem'}}>
						<div style={{border: 'dashed', width: '30%'}}>
							<img src={notifSVG} />
							Your game will start filled with bots.
						</div>
						<button onClick={closeModalAndCreateGame}>Create new game &gt;</button>
					</div>
				</div>
			</div>
		</>
	);
}

export default CreateGame;