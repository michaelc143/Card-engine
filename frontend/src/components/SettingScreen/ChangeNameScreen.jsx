import { useState } from 'react';
import Modal from 'react-modal';
import closeModalBtn from '../../assets/close.svg';
import BiddingScreen from '../BiddingScreen/BiddingScreen';

function ChangeNameScreen({closeModal, currentUsername}){
    const [username, setUsername] = useState('');
    const [displayName, setDisplayName] = useState(currentUsername);
    const [biddingScreenModalIsOpen, setBiddingScreenModalIsOpen] = useState(false);
    

    const handleChange = () => {
        if(username == '')
        {
            alert("new username cannot be blank or empty!");
        }
        else{
            alert("Change is send to backend!Changing username from current: '" + displayName + "' to new: '" + username  + "'.");
            setDisplayName(username);
            setUsername('');
        }		
	};

    const handleClose = () => {
        closeModal(displayName);
    };

    const closeBiddingScreenModal = (value) => {
        console.log(value);
        setBiddingScreenModalIsOpen(false);
        
    };

    const handleBidding = () => {
        setBiddingScreenModalIsOpen(true);
    };
    
    return <>
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
                <button style={{border:'none',background:'none',marginTop:10, marginLeft: '1rem',fontSize: '40px' }}  onClick={handleBidding}>Bidding</button>
                </div>
            </div>
            <Modal
                    isOpen={biddingScreenModalIsOpen}
                    onRequestClose={closeBiddingScreenModal}
                    contentLabel="Bidding screen Modal"
                    style={{
                        overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        },
                        content: {
                            width: '900px',
                            height: '700px',
                            margin: 'auto',
                            borderRadius: '10px',
                            backgroundColor: 'lightcyan'
                        },
                    }}
                    shouldCloseOnOverlayClick={false}
                    >
                    <BiddingScreen closeModal={closeBiddingScreenModal} BiddingSuit={"jack_diamonds"} />
                </Modal>
        </div>        
    </>

}

export default ChangeNameScreen;