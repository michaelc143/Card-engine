import React, { useState } from 'react';
import './FindGame.css';

function FindGame({ closeModal }) {
	return (
		<>
			<h1>Find Game.</h1>
			<button onClick={closeModal}>X</button>
		</>
	);
}

export default FindGame;
