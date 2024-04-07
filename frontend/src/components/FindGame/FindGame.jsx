import React, { useState } from 'react';
import './FindGame.css';
import closeModalBtn from '../../assets/close.svg';

function FindGame({ closeModal }) {
	const sampleNamesList = ['Michael', 'Quinn', 'Tomas', 'Jeremiah', 'Haiyi', 'Aidan'];

	// once we have the endpoint to grab the open games, we will use a useEffect here to grab the available games on component load

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
					{sampleNamesList.map((name) => (
						<div key={name}>
							<p style={{fontWeight: 'bold', width: '33%', display: 'inline-block', marginLeft: '0.5rem'}}>{name}</p>
							<p style={{fontWeight: 'bold', width: '33%', display: 'inline-block'}}>3/4</p>
							<p style={{fontWeight: 'bold', width: '33%', display: 'inline-block'}}>&gt;</p>
						</div>
					))}
				</div>
			</div>
		</>
	);
}

export default FindGame;
