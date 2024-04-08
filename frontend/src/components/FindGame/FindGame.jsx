import React, { useState, useEffect } from 'react';
import './FindGame.css';
import closeModalBtn from '../../assets/close.svg';

function FindGame({ closeModal }) {
	const sampleNamesList = ['Michael', 'Quinn', 'Tomas', 'Jeremiah', 'Haiyi', 'Aidan'];

	// once we have the endpoint to grab the open games, we will use a useEffect here to grab the available games on component load

	const [openGames, setOpenGames] = useState(null);

	useEffect(() => {
		const fetchOpenGames = async () => {
			try {
				const response = await fetch('http://localhost:8080/games/euchre/open-games');
				if (!response.ok) {
					throw new Error('Failed to fetch open games');
				}
				const data = await response.json();
				// setOpenGames(data);
				console.log(data);
			} catch (error) {
				console.error('Error fetching open games:', error);
			}
		};
	
		fetchOpenGames();
	}, []);

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
					{/* {(openGames).map((gameName) => (
						<div key={gameName}>
							<p style={{fontWeight: 'bold', width: '33%', display: 'inline-block', marginLeft: '0.5rem'}}>
								{gameName}: {openGames[gameName].game_id}
							</p>
							<p style={{fontWeight: 'bold', width: '33%', display: 'inline-block'}}>
								{openGames[gameName].number_players}/4
							</p>
							<p style={{fontWeight: 'bold', width: '33%', display: 'inline-block'}}>&gt;</p>
						</div>
					))} */}
				</div>
			</div>
		</>
	);
}

export default FindGame;
