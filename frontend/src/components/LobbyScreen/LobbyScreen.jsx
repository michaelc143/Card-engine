import React from "react";
import closeModalBtn from '../../assets/close.svg';
import notifSVG from '../../assets/notif-icon.svg';
import './LobbyScreen.css';

function LobbyScreen({ closeModal, username }) {

    // We'll need a useEffect on component load to check for whos in the game currently, then use websockets for them to communicate with one another
    // RN just using dummy data for people name
    const playerNames = ['Player2', 'Player3', 'Player4'];

    return(
        <>
            <div className='lobby'>
				<div className='upper-bar'>
					<h2 className='menu-header'>Lobby.</h2>
                    <img className='closeModalX' src={closeModalBtn} onClick={closeModal} alt='close'/>
				</div>
                <div style={{ marginLeft: '1rem' }}>
                    <h4 style={{ width: '45%', display: 'inline-block'}}>Players:</h4>
                    <h4 style={{ width: '45%', display: 'inline-block', textAlign: 'center' }}>Ready:</h4>
                </div>
                <div style={{ marginLeft: '1rem' }}>
                    <text style={{ width: '45%', display: 'inline-block', fontSize: '32px', marginBottom: '1rem'}}>{username}</text> { /* Display their username as the first one */ }
                    <input style={{ width: '45%', display: 'inline-block' }} type="checkbox" />
                </div>
                {playerNames.map((name) => (
                    <div key={name} style={{ marginLeft: '1rem' }}>
                        <text style={{ width: '45%', display: 'inline-block', fontSize: '32px', marginBottom: '1rem' }}>{name}</text>
                        <input style={{ width: '45%', display: 'inline-block' }} type="checkbox" />
                    </div>
                ))}
                <div className="notif-box" style={{display: 'flex', justifyContent: 'space-between', marginTop: '1rem'}}>
                    <div style={{border: 'dashed', width: '30%'}}>
                        <img src={notifSVG} />
                        Your game will start filled with bots.
                    </div>
                    <button>Start game &gt;</button>
                </div>
			</div>
        </>
    );
}

export default LobbyScreen;