import React from "react";
import closeModalBtn from '../../assets/close.svg';

function LobbyScreen({ closeModal }) {
    return(
        <>
            <div className='lobby'>
				<div className='upper-bar'>
					<h2 className='menu-header'>Lobby.</h2>
                    <img className='closeModalX' src={closeModalBtn} onClick={closeModal} alt='close'/>
				</div>
			</div>
        </>
    );
}

export default LobbyScreen;