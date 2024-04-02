import React, { useState } from 'react';
import './CreateGame.css';

function CreateGame({ closeModal }) {
	return (
		<>
			<h1>Create Game.</h1>
			<button onClick={closeModal}>X</button>
		</>
	);
}

export default CreateGame;