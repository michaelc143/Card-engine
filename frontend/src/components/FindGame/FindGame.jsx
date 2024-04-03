import React, { useState } from 'react';
import './FindGame.css';
import closeModalBtn from '../../assets/close.svg';

function FindGame({ closeModal }) {
	return (
		<>
			<div className='find-game'>
				<div className='upper-bar'>
					<h2 className='menu-header'>Find Game.</h2>
					<img className='closeModalX' src={closeModalBtn} onClick={closeModal} />
				</div>
			</div>
		</>
	);
}

export default FindGame;
