import React from 'react'; 
import sprite from '../../assets/sprite.svg'; // Import SVG that has all cards compiled into one

// 
function BiddingScreen({ closeModal, userID, BiddingSuit }) {

    // Function to handle picking up the bid
    const handlePickup = () => {
        closeModal('Pickitup'); // Calls this to pick up the card
    }

    // Function to handle passing the bid
    const handlePass = () => {
        closeModal('Pass'); // Calls this to pass 
    }

    return (
        <>
            <div>
                <div className='upper-bar'>
                    {/* Header for the bidding screen */}
                    <h2 style={{ marginLeft: '1rem' }} className='menu-header'>Bidding.</h2>
                </div>
            </div>
            <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Displaying the current bidding suit */}
                <label className='home' style={{ fontSize: '50px', fontFamily: 'verdana' }}>The candidate suit is:</label>
            </div>
            <div style={{ marginTop: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="300" height="300">
                    <use href={`${sprite}#${BiddingSuit}`} />
                </svg>
            </div>
            <div style={{ marginLeft: '3rem', marginTop: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Button to pick up the bid */}
                <h3 style={{ width: '40%', display: 'inline-block', cursor: 'pointer' }} onClick={handlePickup}>Pick it up</h3>
                <h4 style={{ width: '20%', display: 'inline-block' }}>Or</h4>
                {/* Button to pass the bid */}
                <h3 style={{ width: '40%', display: 'inline-block', textAlign: 'center', cursor: 'pointer' }} onClick={handlePass}>Pass</h3>
            </div>
        </>
    )

}

// Exporting the BiddingScreen component as default
export default BiddingScreen;
