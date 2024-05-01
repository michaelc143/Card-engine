import React, { useContext, useState } from 'react';
import Modal from 'react-modal';
import closeModalBtn from '../../assets/close.svg';
import ChangeNameScreen from './ChangeNameScreen';
import { UserContext } from '../../contexts/UserContext';


function SettingScreen({ closeModal, username }) {

    const { user } = useContext(UserContext);
    const [changeNameScreenModalIsOpen, setChangeNameScreenModalIsOpen] = useState(false);
    const [presentUsername, setPresentUsername] = useState(username);

    const deleteAccount = () => {
            fetch(`http://localhost:8080/player/${user.user_id}`, {method: 'DELETE',})
                .then(response => response.text())
                    .then(data => {
                        console.log(data); // Used in development to debug
                        if (data > -1) {
                            alert("Account has been deleted. This will return to Login screen.");
                            setPresentUsername('*Cleared*');
                            closeModal('*Cleared*');
                        } 
                        else {
                            alert('Delete Account is failed');
                        }
                    })
                .catch(error => {
                    console.error('Error:', error);
            });    
            
        }
    const resetStats = () => {
            //console.log("Reset Stats is called")
            fetch(`http://localhost:8080/player/${user.user_id}/stats`, {method: 'DELETE',})
            .then(response => response.text())
                .then(data => {
                    console.log(data); // Used in development to debug
                    if (data == "true") {
                        alert("Stats have been reset");
                       
                    } 
                    else {
                        alert('Stats reset failed');
                    }
                })
            .catch(error => {
                console.error('Error:', error);
        });
    }
    
    const changeUser = () => {
            setChangeNameScreenModalIsOpen(true);
        }

    const closeChangeNameScreenModal = (value) => {
            setPresentUsername(value);
            setChangeNameScreenModalIsOpen(false);
            
        };
    
    const closeSetting = () => {
            closeModal(presentUsername);            
        }
    
    return(
        <>
            <div>
                <div className='upper-bar'>
                    <h2 style={{marginLeft: '1rem'}} className='menu-header'>Setting.</h2>
                    <img className='closeModalX' src={closeModalBtn} onClick={closeSetting} alt='close'/>						
                </div>
                <h3 style={{marginTop:10,marginLeft: '1rem'}}>Account:</h3>
                <div style={{marginLeft: '1rem',display: 'flex'}}>
                    <label className='home' style={{fontSize:'40px',width: '45%',display: 'inline-block'}}>Change Username</label>
                    <button className="login-btn" onClick={changeUser}>&gt;</button>
                </div>
                <div style={{marginTop:10,marginLeft: '1rem',display: 'flex'}}>
                    <label className='home' style={{fontSize:'40px',width: '45%',display: 'inline-block'}}>Reset Stats</label>
                    <button className="login-btn" onClick={resetStats}>&gt;</button>
                </div>
                <div style={{marginTop:10,marginLeft: '1rem',display: 'flex'}}>
                    <label className='home' style={{fontSize:'40px',width: '45%',display: 'inline-block'}}>Delete Account</label>
                    <button className="login-btn" onClick={deleteAccount}>&gt;</button>
                </div>             
               <Modal
                    isOpen={changeNameScreenModalIsOpen}
                    onRequestClose={closeChangeNameScreenModal}
                    contentLabel="Change username Modal"
                    style={{
                        overlay: {
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            },
                        content: {
                            width: '900px',
                            height: '700px',
                            margin: 'auto',
                            borderRadius: '10px',
                            },
                        }}
                    shouldCloseOnOverlayClick={false}
                    >
                    <ChangeNameScreen closeModal={closeChangeNameScreenModal} currentUsername={presentUsername} userID={user.user_id} />
                </Modal>
            </div>            
        </>
    );
}

export default SettingScreen;