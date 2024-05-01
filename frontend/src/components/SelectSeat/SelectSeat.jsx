import closeModalBtn from '../../assets/close.svg';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';

function SelectSeat({ showToast, closeModal, selectedGameId, openLobbyScreenModal }) {

	const { user } = useContext(UserContext);
	const [gameInfo, setGameInfo] = useState(null);

	// Grabs the latest game info for a game with the specified selectedGameId
	useEffect(() => {
		const fetchGameInfo = async () => {
			try {
				const response = await fetch(`http://localhost:8080/games/euchre/${selectedGameId}`);
				if (!response.ok) {
					throw new Error('Failed to fetch game info');
			}
			const data = await response.json();
			setGameInfo(data);
			console.log(data);
			} catch (error) {
				console.error('Error fetching game info:', error);
			}
		};
	
		fetchGameInfo();
	}, [selectedGameId]);

	//request that gets called to have a user join a game 
	const joinGame = async (seatNumber) => {
		try {
			const response = await fetch(`http://localhost:8080/games/euchre/${selectedGameId}/select-seat?playerID=${user.user_id}&seatNumber=${seatNumber}`, {
			method: 'POST',
			});
		
			if (!response.ok) {
			throw new Error('Failed to join game');
			}
			else { //Successfully selected seat, close this modal and open the lobby modal
				showToast('Successfully joined game', 'success');
				closeModal();
				openLobbyScreenModal();
			}
		
			const data = await response.text();
			console.log(data); // Log the response message
			// Optionally, you can perform additional actions after joining the game
		} catch (error) {
			console.error('Error joining game:', error);
		}
	};

	// Loading indicator while it's waiting for the game info
	if (!gameInfo) {
		return <div>Loading...</div>;
	}

	// Renders the seat number and player name for a given seat, also a button to select the seat if someone not there
	const renderSeat = (seatNumber) => (
		<div key={seatNumber}>
			{!gameInfo[`player${seatNumber}_name`] && (
				<button onClick={() => joinGame(seatNumber)}>
				Select Seat {seatNumber}
				</button>
			)}
			<p>Player {seatNumber}: {gameInfo[`player${seatNumber}_name`]}</p>
		</div>
	);

	/**
	* SelectSeat component renders the UI for selecting a seat in a game lobby.
	* 
	* @prop {object} gameInfo - An object containing information about the game.
	*   @prop {string} gameInfo.game_name - The name of the game.
	*   @prop {number} gameInfo.game_id - The ID of the game.
	*   @prop {string} gameInfo.creation_date - The date and time the game was created.
	* @prop {function} closeModal - A function to close the "Select Seat" modal.
	* @prop {string} closeModalBtn - The image source for the close button.
	* @prop {function} renderSeat - A function that renders the UI for a single seat. This function is expected to take a seat number as an argument.
	*/
	return(
		<>
			<div className='lobby'>
				<div className='upper-bar'>
					<h2 className='menu-header'>Select Seat.</h2>
					<img className='closeModalX' src={closeModalBtn} onClick={closeModal} alt='close'/>
				</div>
				<h2>Name: {gameInfo.game_name}, ID: {gameInfo.game_id}</h2>
				<div>
					<div style={{display: 'flex', justifyContent: 'center'}}>
						{renderSeat(1)}
					</div>
					<div style={{display: 'flex', justifyContent: 'space-between'}}>
						<div>
							{renderSeat(4)}
						</div>
						<div>
							{renderSeat(2)}
						</div>
					</div>
					<div style={{display: 'flex', justifyContent: 'center'}}>
						{renderSeat(3)}
					</div>
				</div>
				<p>Creation Date: {gameInfo.creation_date}</p>
			</div>
		</>
	);
}

export default SelectSeat;