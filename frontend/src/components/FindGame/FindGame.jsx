import { useState, useEffect } from 'react';
import './FindGame.css';
import closeModalBtn from '../../assets/close.svg';

function FindGame({ closeModal, openSelectSeatModal }) {

	const [openGames, setOpenGames] = useState({}); // game_name above in obj hierarchy, game_id, number_players

	// Runs on component load
	// Fetches all open games from the backend/db
	useEffect(() => {
		const fetchOpenGames = async () => {
			try {
				const response = await fetch('http://localhost:8080/games/euchre/open-games');
				if (!response.ok) {
					throw new Error('Failed to fetch open games');
				}
				const data = await response.json();
				console.log(data);
				setOpenGames(data);
			} catch (error) {
				console.error('Error fetching open games:', error);
			}
		};
	
		fetchOpenGames();
	}, []);

	/**
	* Renders the UI for finding available games.
	* 
	* @prop {object} openGames - Object containing information about open games. Keys are game names, values are game data objects.
	* @prop {function} closeModal - Function to close the "Find Game" modal.
	* @prop {string} closeModalBtn - The image source for the close button.
	* @prop {function} openSelectSeatModal - Function to open the "Select Seat" modal for a specific game.
	*/
	return (
		<>
			<div className='find-game'>
				<div className='upper-bar'>
					<h2 className='menu-header'>Find Game.</h2>
					<img className='closeModalX' src={closeModalBtn} onClick={closeModal} alt='close'/>
				</div>
				<h3 style={{marginLeft: '1rem'}}>Available Games:</h3>
				<div className='available-games'>
					<div style={{textDecoration: 'underline'}}>
						<p style={{fontWeight: 'bold', width: '33%', display: 'inline-block', marginLeft: '0.5rem'}}>Name:</p>
						<p style={{fontWeight: 'bold', width: '33%', display: 'inline-block'}}>Players:</p>
						<p style={{fontWeight: 'bold', width: '33%', display: 'inline-block'}}></p>
					</div>
					{Object.entries(openGames).map(([gameName, gameData]) => (
							<div key={gameName}>
								<p style={{fontWeight: 'bold', width: '33%', display: 'inline-block', marginLeft: '0.5rem'}}>
								{gameName} : ID {gameData.game_id}
								</p>
								<p style={{fontWeight: 'bold', width: '33%', display: 'inline-block'}}>
								{gameData.number_players}/4
								</p>
								<button
									style={{ fontWeight: 'bold', width: '33%', display: 'inline-block', background: 'none', border: 'none' }}
									onClick={() => openSelectSeatModal(gameData.game_id)}
								>
									&gt;
								</button>
							</div>
					))}
				</div>
			</div>
		</>
	);
}

export default FindGame;
