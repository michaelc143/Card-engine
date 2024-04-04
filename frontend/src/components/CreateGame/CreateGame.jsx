import React, { useState } from 'react';
import './CreateGame.css';
import closeModalBtn from '../../assets/close.svg';

function CreateGame({ closeModal }) {
	return (
		<>
			<div className='create-game'>
				<div className='upper-bar'>
					<h2 className='menu-header'>Create Game.</h2>
					<img className='closeModalX' src={closeModalBtn} onClick={closeModal} alt='close'/>
				</div>
			</div>
		</>
	);
}

export default CreateGame;