import sprite from '../../assets/sprite.svg'

function BiddingScreen({ closeModal, BiddingSuit}) {
    
    const handlePickup = () => {
        closeModal('Pickitup');
    }

    const handlePass = () => {
        closeModal('Pass');
    }

    return (
        <>
            <div>
                <div className='upper-bar'>
                    <h2 style={{marginLeft: '1rem'}} className='menu-header'>Bidding.</h2>				
                </div>
            </div>
            <div style={{marginTop:20,display:'flex',alignItems:'center',justifyContent:'center' }}>
                <label className='home' style={{fontSize:'50px',fontFamily:'verdana'}}>The candidate suit is:</label>
            </div>
            <div style={{ marginTop:60, display:'flex',alignItems:'center',justifyContent:'center' }}>
                <svg width="300" height="300">
                    <use href={`${sprite}#${BiddingSuit}`}/>
                </svg>
            </div>
            <div style={{ marginLeft: '3rem',marginTop:30, display:'flex',alignItems:'center',justifyContent:'center' }}>
                <h3 style={{ width: '40%', display: 'inline-block',cursor:'pointer'}} onClick={handlePickup}>Pick it up</h3>
                <h4 style={{ width: '20%', display: 'inline-block'}} >Or</h4>
                <h3 style={{ width: '40%', display: 'inline-block', textAlign: 'center',cursor:'pointer' }} onClick={handlePass}>Pass</h3>
            </div>          
        </>
    )

}
export default BiddingScreen;
