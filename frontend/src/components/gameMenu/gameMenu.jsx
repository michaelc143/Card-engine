import React from 'react';
import Modal from 'react-modal';
import accountSVG from '../../assets/account.svg'
import settingsSVG from '../../assets/settings.svg';
import FindGame from '../FindGame/FindGame';
import CreateGame from '../CreateGame/CreateGame';

function gameMenu( {openfindGameModal, closefindGameModal, findGameModalIsOpen, openCreateGameModal, closeCreateGameModal, createGameModalIsOpen, showToast} ) {
    return(
            <>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <div className='upper-bar'>
                        <h2 className='menu-header'>Menu.</h2>
                        <div>
                            <img src={accountSVG} alt='account'/>
                            <img src={settingsSVG} alt='settings'/>
                        </div>
                    </div>
                    <a className='menu-button' style={{marginLeft: '35rem'}} onClick={openfindGameModal}>
                        Find Game
                    </a>
                    <Modal // Find Game modal popup
                        isOpen={findGameModalIsOpen}
                        onRequestClose={closefindGameModal}
                        contentLabel="Registration Modal"
                        style={{
                            overlay: {
                                backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
                            },
                            content: {
                                width: '900px',
                                height: '700px',
                                margin: 'auto',
                                borderRadius: '10px', // Add this line to round the edges
                            },
                        }}
                    >
                        <FindGame
                            showToast={showToast}
                            closeModal={closefindGameModal}
                        />
                    </Modal>
                    <p style={{textAlign: 'center'}}>-or-</p>
                    <a style={{display: 'flex', justifyContent: 'flex-end', marginRight: '35rem'}} className='menu-button' onClick={openCreateGameModal}>
                        Create Game
                    </a>
                    <Modal //create game modal popup
                        isOpen={createGameModalIsOpen}
                        onRequestClose={closeCreateGameModal}
                        contentLabel="Registration Modal"
                        style={{
                            overlay: {
                                backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
                            },
                            content: {
                                width: '900px',
                                height: '700px',
                                margin: 'auto',
                                borderRadius: '10px', // Add this line to round the edges
                            },
                        }}
                    >
                        <CreateGame
                            showToast={showToast}
                            closeModal={closeCreateGameModal}
                        />
                    </Modal>
                </div>
			</>
    );
}

export default gameMenu;