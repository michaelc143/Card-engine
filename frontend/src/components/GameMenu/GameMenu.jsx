import { useState } from 'react';
import Modal from 'react-modal';
import accountSVG from '../../assets/account.svg'
import settingsSVG from '../../assets/settings.svg';
import FindGame from '../FindGame/FindGame';
import CreateGame from '../CreateGame/CreateGame';
import LobbyScreen from '../LobbyScreen/LobbyScreen';
import SelectSeat from '../SelectSeat/SelectSeat';
import SettingScreen from '../SettingScreen/SettingScreen';
import GameBoard from '../GameBoard';

function GameMenu( {openfindGameModal, closefindGameModal, findGameModalIsOpen, openCreateGameModal, closeCreateGameModal, createGameModalIsOpen, showToast, userID,username, reloadLogin} ) {

	const [lobbyScreenModalIsOpen, setLobbyScreenModalIsOpen] = useState(false);
	const [showSelectSeatModal, setShowSelectSeatModal] = useState(false);
	const [selectedGameId, setSelectedGameId] = useState(null);
	const [currentlyPlaying, setCurrentlyPlaying] = useState(false); // used to decide whether to show normal game menu or the game board

	const [presentUsername, setPresentUsername] = useState(username)
	const [settingScreenModalIsOpen, setSettingScreenModalIsOpen] = useState(false);

	// console.log("userID:" + userID);
	// console.log("username:" + username);

	const openSelectSeatModal = (gameId) => {
		closefindGameModal();
		console.log("GameID:" + gameId);
		setSelectedGameId(gameId);
		console.log("Selected game ID: " + selectedGameId);
		setShowSelectSeatModal(true);
	};

	const closeSelectSeatModal = () => {
		setShowSelectSeatModal(false);
	};

	// opens lobby screen modal popup
	const openLobbyScreenModal = () => {
		setLobbyScreenModalIsOpen(true);
	};
	
	// closes lobby screen modal popup
	const closeLobbyScreenModal = () => {
		setLobbyScreenModalIsOpen(false);
	};

	// closes setting screen modal popup
	const closeSettingScreenModal = (value) => {
		setPresentUsername(value);
		setSettingScreenModalIsOpen(false);
		if(value == '*Cleared*')
		{
			reloadLogin("");
		}
	};

	const openSettingScreenModal = () => {
		setSettingScreenModalIsOpen(true);
	};

	return(
			currentlyPlaying ? 
				<>
				<GameBoard 
					userID={userID}
					selectedGameID={selectedGameId}/>
				</> 
				: 
				<>
					<div style={{display: 'flex', flexDirection: 'column'}}>
						<div className='upper-bar'>
							<h2 style={{marginLeft: '1rem'}} className='menu-header'>Menu.</h2>
							<div>
								<img src={accountSVG} alt='account'/>
								<img style={{marginLeft: '1rem', marginRight: '1rem'}} src={settingsSVG} alt='settings' onClick={openSettingScreenModal}/>
							</div>
						</div>
						<a className='menu-button' style={{marginLeft: '35rem', marginTop: '2rem'}} onClick={openfindGameModal}>
							Find Game
						</a>
						<Modal // Find Game modal popup
							isOpen={findGameModalIsOpen}
							onRequestClose={closefindGameModal}
							contentLabel="Registration Modal"
							style={{
								overlay: {
									backgroundColor: 'rgba(0, 0, 0, 0.5)',
								},
								content: {
									width: '900px',
									height: '700px',
									margin: 'auto',
									borderRadius: '10px',
								},
							}}
						>
							<FindGame
								showToast={showToast}
								closeModal={closefindGameModal}
								openSelectSeatModal={openSelectSeatModal}
							/>
						</Modal>
						<p style={{textAlign: 'center'}}>-or-</p>
						<a style={{display: 'flex', justifyContent: 'flex-end', marginRight: '35rem'}} className='menu-button' onClick={openCreateGameModal}>
							Create Game
						</a>
						<Modal //create game modal popup
							isOpen={createGameModalIsOpen}
							onRequestClose={closeCreateGameModal}
							contentLabel="Registration Modal"
							style={{
								overlay: {
									backgroundColor: 'rgba(0, 0, 0, 0.5)',
								},
								content: {
									width: '900px',
									height: '600px',
									margin: 'auto',
									borderRadius: '10px',
								},
							}}
						>
							<CreateGame
								showToast={showToast}
								closeModal={closeCreateGameModal}
								openLobbyScreenModal={openLobbyScreenModal}
								userID={userID}
								setSelectedGameId={setSelectedGameId}
							/>
						</Modal>
						<Modal
							isOpen={lobbyScreenModalIsOpen}
							onRequestClose={closeLobbyScreenModal}
							contentLabel="Lobby Screen Modal"
							style={{
								overlay: {
								backgroundColor: 'rgba(0, 0, 0, 0.5)',
								},
								content: {
								width: '900px',
								height: '700px',
								margin: 'auto',
								borderRadius: '10px',
								},
							}}
						>
							{selectedGameId !== null &&
								<LobbyScreen 
									closeModal={closeLobbyScreenModal}
									selectedGameId={selectedGameId}
									username={username}
									userID={userID}
									setCurrentlyPlaying={setCurrentlyPlaying}
								/>}
						</Modal>
						<Modal
							isOpen={showSelectSeatModal}
							onRequestClose={closeSelectSeatModal}
							contentLabel="SelectSeat Modal"
							style={{
								overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
								content: { width: '900px', height: '700px', margin: 'auto', borderRadius: '10px' },
							}}
							>
							<SelectSeat
								showToast={showToast}
								selectedGameId={selectedGameId}
								closeModal={closeSelectSeatModal}
								openLobbyScreenModal={openLobbyScreenModal}
								userID={userID}
							/>
						</Modal>
						<Modal
							isOpen={settingScreenModalIsOpen}
							onRequestClose={closeSettingScreenModal}
							contentLabel="Setting screen Modal"
							style={{
								overlay: {
								backgroundColor: 'rgba(0, 0, 0, 0.5)',
								},
								content: {
								width: '900px',
								height: '700px',
								margin: 'auto',
								borderRadius: '10px',
								},
							}}
							shouldCloseOnOverlayClick={false}
						>
							<SettingScreen closeModal={closeSettingScreenModal} userid={userID} username={presentUsername} />
						</Modal>
					</div>
				</>
	);
}

export default GameMenu;