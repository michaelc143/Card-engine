import { useState } from 'react';
import Modal from 'react-modal';
import closeModalBtn from '../../assets/close.svg';
import GameScreen from '../GameScreen/GameScreen';
import {ToastContainer, toast} from 'react-toastify';

function ChangeNameScreen({closeModal, userID, currentUsername}){
    const [username, setUsername] = useState('');
    const [displayName, setDisplayName] = useState(currentUsername);
    
    const [gameScreenModalIsOpen, setGameScreenModalIsOpen] = useState(false);

    const showToast = (message, type) => {
		toast[type](message);
	}

    const handleChange = () => {
        if(username == '')
        {
            alert("new username cannot be blank or empty!");
        }
        else{
            fetch(`http://localhost:8080/player/${userID}/change-username?newUserName=${username}`, {method: 'POST'})
            .then(response => response.text())
                .then(data => {
                    if (data == 'successful') {
                        //alert("Username changes from " + displayName + "' to '" + username  + "'.");
                        showToast(`Successfully change username from ${displayName} to ${username}`, 'success');
                        setDisplayName(username);
                        setUsername('');
                    }
                    else {
                        alert("Changing username is failed.");
                    }
                })
            .catch(error => {
                console.error('Error:', error);
        });

        }		
	};

    const handleClose = () => {
        closeModal(displayName);
    };

    const handleGameScreen = () => {
        setGameScreenModalIsOpen(true);
    };

    const closeGameScreenModal = (value) => {
        setGameScreenModalIsOpen(false);
        
    };

    const playCards = ["ace_hearts","jack_hearts","queen_clubs","nine_hearts","queen_hearts"];
    
    return <>
        <ToastContainer
			limit={5}
			stacked={true}
		/>
        <div>
            <div className='upper-bar'>
                <h2 style={{marginLeft: '1rem'}} className='menu-header'>Change Username.</h2>
                <img className='closeModalX' src={closeModalBtn} onClick={handleClose} alt='close'/>						
            </div>
            <div>
                <div style={{marginTop:40}}>
                    <label className='home' style={{fontSize:'40px',marginLeft: '1rem', marginRight:10}}>Current:</label>
                    <label style={{fontSize:'40px',marginBottom:20}}>{displayName}</label>
                </div>
                <div style={{marginTop:20}}>
                    <label className='home' style={{fontSize:'40px',marginLeft: '1rem',marginRight:50}}>New:</label>
                    <input
                        type="text"					
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}					
                        style={{fontSize:'40px',marginBottom:30}}
                    />
                    <button style={{ marginTop:10,marginBottom:20,marginLeft: '1rem',fontSize: '30px' }}  onClick={handleChange}>Change</button>
                </div>
                <div>
                    <button style={{border:'none',background:'none',marginTop:10, marginLeft: '1rem',fontSize: '40px' }}  onClick={handleGameScreen}>GameScreen</button>
                </div>
            </div>
            <Modal
                    isOpen={gameScreenModalIsOpen}
                    onRequestClose={closeGameScreenModal}
                    contentLabel="Game screen Modal"
                    style={{
                        overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        },
                        content: {
                            width: '1000px',
                            height: '900px',
                            margin: 'auto',
                            borderRadius: '10px',
                        },
                    }}
                    shouldCloseOnOverlayClick={false}
                    >
                    <GameScreen closeGameScreen={closeGameScreenModal} player02={'Player 02'} player03={'Player 03'} player04={'Player 04'} gamephase={'First Bidding'} gameCards={[]} playingCards={playCards} />
            </Modal>
        </div>        
    </>

}

export default ChangeNameScreen;