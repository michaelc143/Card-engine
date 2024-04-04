import React, { useState } from 'react';
import './CreateGame.css';
import closeModalBtn from '../../assets/close.svg';
import arrowSVG from '../../assets/return-arrow.svg';
import notifSVG from '../../assets/notif-icon.svg';

function CreateGame({ closeModal }) {

	const [gameName, setGameName] = useState('');
	const [isPrivate, setIsPrivate] = useState(false);
	const [password, setPassword] = useState('');
	const [maxPlayers, setMaxPlayers] = useState(1);

	const handleGameNameChange = (e) => setGameName(e.target.value);
	const handlePrivateToggle = () => setIsPrivate(!isPrivate);
	const handlePasswordChange = (e) => setPassword(e.target.value);
	const handleMaxPlayersChange = (e) => setMaxPlayers(parseInt(e.target.value));

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
						Name: <input type="text" className='input-box textfield' placeholder='Name' value={gameName} onChange={handleGameNameChange} /> <text style={{color: 'red', fontStyle: 'italic'}}>required.</text>
					</label>
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
						<button>Create new game &gt;</button>
					</div>
				</div>
			</div>
		</>
	);
}

export default CreateGame;