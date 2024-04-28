import React, { useState,useEffect } from 'react';
import Modal from 'react-modal';
import './GameScreen.css';
import sprite from '../../assets/sprite.svg'
import closeModalBtn from '../../assets/close.svg';
import BiddingScreen from '../BiddingScreen/BiddingScreen';


function GameScreen({ closeGameScreen,player02,player03,player04,gamephase,gameCards,playingCards}) {
    
    const [currentCards, setCurrentCards] = useState(playingCards);
    //const [cardsuits, setCardsuits] = useState(gameCards);

    const [firstBidding,setFirstBidding] = useState(gamephase);
    const [secondBidding,setSecondBidding] = useState('');
    const [biddingScreenModalIsOpen, setBiddingScreenModalIsOpen] = useState(false);

    const [biddingSuit,setBiddingSuit] = useState('jack_diamonds');
    const [biddingRound,setBiddingRound] = useState('First');
    const [TrumpSuit,setTrumpSuit] = useState('');

    //game cards for each player
    const [yourCard,setYourCard] = useState('');
    const [player02Card,setPlayer02Card] = useState('');
    const [player03Card,setPlayer03Card] = useState('');
    const [player04Card,setPlayer04Card] = useState('');

      
    const closeBiddingScreenModal = (value) => {
        setBiddingScreenModalIsOpen(false);
        if(value == "Pass")
        {
            setSecondBidding("Second Bidding");
            if(firstBidding == '')
            {
                setTrumpSuit('');
            }
        }
        else{
            if(firstBidding == 'First Bidding')
            {
                setTrumpSuit('jack_diamonds');
            }            
            setFirstBidding('');

            if(secondBidding == 'Second Bidding')
            {
                setTrumpSuit('king_spades');
            }
            setSecondBidding('');
        }
    };

    const closeGame = () => {
        closeGameScreen();            
    }

    /* const loadGameCards = cardsuits.map((cardsuit) => 
        <div>
            <svg transform="rotate(90 50 50)" key={cardsuit} id={cardsuit} width='100' height='150'>
                <use href={`${sprite}#${cardsuit}`}/>
            </svg>
        </div>
    ); */

    const loadPlayingCards =  currentCards.map((playcard) =>
            <div>
                <svg key={playcard} id={playcard} width='144' height='200' onClick={(event) => handleCardClick(event.currentTarget.attributes[0].nodeValue)}>
                    <use href={`${sprite}#${playcard}`}/>
                </svg>
            </div>        
        );

    useEffect(() => {
        if(firstBidding == "First Bidding")
        {
            
            setBiddingScreenModalIsOpen(true);
        }

    }, []);

    useEffect(() => {
        if(secondBidding == "Second Bidding")
        {
            setBiddingRound('Second');
            setBiddingSuit('king_spades');
            setBiddingScreenModalIsOpen(true);
        }
    }, [secondBidding]);
   
    const handleCardClick = (value) => {
        //style={{animation: `spin 3s linear infinite`}}
        //remove selected card from own current cards        
        setCurrentCards(currentCards.filter(a => a != value));
        loadPlayingCards;

        /* //Clear game cards
        cardsuits.splice(0,cardsuits.length);
        setCardsuits(cardsuits);
        loadGameCards; */
        
        //Add to playing cards
        //All other player cards are simulated
        //default heart is trump suit
        if(TrumpSuit == 'jack_diamonds')
        {
            if(value == "ace_hearts")
            {            
                setYourCard(value); // add the your card
                setPlayer02Card("king_spades"); // add the player 2 card
                setPlayer03Card("ten_spades"); // add the player 3 card
                setPlayer04Card("ten_clubs"); // add the player 4 card
                
            }

            if(value == "jack_hearts")
            {
                
                setYourCard(value); // add the your card
                setPlayer02Card("king_clubs"); // add the player 2 card
                setPlayer03Card("nine_spades"); // add the player 3 card
                setPlayer04Card("ten_diamonds"); // add the player 4 card                
            }

            if(value == "queen_clubs")
            {
                setYourCard(value); // add the your card
                setPlayer02Card("ten_hearts"); // add the player 2 card
                setPlayer03Card("nine_clubs"); // add the player 3 card
                setPlayer04Card("queen_diamonds"); // add the player 4 card 
                
            }

            if(value == "nine_hearts")
            {
                setYourCard(value); // add the your card
                setPlayer02Card("jack_spades"); // add the player 2 card
                setPlayer03Card("queen_spades"); // add the player 3 card
                setPlayer04Card("jack_diamonds"); // add the player 4 card 

                
            }

            if(value == "queen_hearts")
            {
                setYourCard(value); // add the your card
                setPlayer02Card("nine_diamonds"); // add the player 2 card
                setPlayer03Card("king_hearts"); // add the player 3 card
                setPlayer04Card("king_diamonds"); // add the player 4 card 

            }

        }
        
        if(TrumpSuit == 'king_spades')
        {
            if(value == "ace_hearts")
            {
                setYourCard(value); // add the your card
                setPlayer02Card("king_clubs"); // add the player 2 card
                setPlayer03Card("ten_spades"); // add the player 3 card
                setPlayer04Card("ten_diamonds"); // add the player 4 card 
               
            }

            if(value == "jack_hearts")
            {
                setYourCard(value); // add the your card
                setPlayer02Card("king_spades"); // add the player 2 card
                setPlayer03Card("nine_spades"); // add the player 3 card
                setPlayer04Card("ten_clubs"); // add the player 4 card                 
            }

            if(value == "queen_clubs")
            {
                setYourCard(value); // add the your card
                setPlayer02Card("ten_hearts"); // add the player 2 card
                setPlayer03Card("queen_spades"); // add the player 3 card
                setPlayer04Card("jack_clubs"); // add the player 4 card 

                
            }

            if(value == "nine_hearts")
            {
                setYourCard(value); // add the your card
                setPlayer02Card("jack_spades"); // add the player 2 card
                setPlayer03Card("nine_clubs"); // add the player 3 card
                setPlayer04Card("jack_diamonds"); // add the player 4 card 
                
            }

            if(value == "queen_hearts")
            {
                setYourCard(value); // add the your card
                setPlayer02Card("nine_diamonds"); // add the player 2 card
                setPlayer03Card("king_hearts"); // add the player 3 card
                setPlayer04Card("king_diamonds"); // add the player 4 card 

            }

        }
    }

    return <>
        <div>
            <div>
                <div className='upper-bar'>
                    <h2 style={{marginLeft: '1rem'}} className='menu-header'>GameScreen.</h2>
                    <img className='closeModalX' src={closeModalBtn} onClick={closeGame} alt='close'/>				
                </div>
                <div style={{marginTop:-30,display: 'flex',alignItems:'center'}}>
                    <div>
                        <h4>
                            The trump suit is:
                        </h4>
                    </div>
                    <div>
                        <svg width='50' height='60'>
                            <use href={`${sprite}#${TrumpSuit}`}/>
                        </svg>
                    </div>
                </div>                
            </div>
            <div style={{ marginTop:-160, marginBottom:-50, display:'flex', flexDirection: 'column', alignItems:'center',justifyContent:'center' }}>
                <h3>
                    {player03}
                </h3>
                <svg style={{marginTop:-30}} width='80' height='100'>
                    <use href={`${sprite}#${player03Card}`}/>
                </svg>			
            </div>
            <div>
                <div style={{display:'flex', alignItems:'center',justifyContent:'space-between'}}>
                    <h3>{player02}</h3>
                    <svg width='80' height='100'>
                        <use href={`${sprite}#${player02Card}`}/>
                    </svg>
                    <svg width='80' height='100'>
                        <use href={`${sprite}#${player04Card}`}/>
                    </svg>
                    <h3>{player04}</h3>
                </div>
                <div>
                                        
                </div>
            </div>
            <div style={{marginTop:-30, display:'flex', flexDirection: 'column',alignItems:'center',justifyContent:'center' }}>
                <svg width='80' height='100'>
                    <use href={`${sprite}#${yourCard}`}/>
                </svg>
                <h3 style={{marginTop:10}}>
                    You
                </h3>				
            </div>
            <div style={{ marginTop:-20,display:'flex',alignItems:'center',justifyContent:'space-between' }}>
                <h3 style={{ width: '10%', display: 'inline-block'}} ></h3>
                <div style={{display: 'flex'}}>
                    {loadPlayingCards}
                </div>
                <h3 style={{ width: '10%', display: 'inline-block'}} ></h3>
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
                        width: '700px',
                        height: '680px',
                        margin: 'auto',
                        borderRadius: '10px',
                        backgroundColor: 'lightcyan'
                    },
                }}
                shouldCloseOnOverlayClick={false}
                >
                <BiddingScreen closeModal={closeBiddingScreenModal} BiddingRound={biddingRound} BiddingSuit={biddingSuit} />
            </Modal>
        </div>
    </>
}

export default GameScreen;

{/* <div style={{ marginLeft: '3rem', marginBottom:-60,display:'flex',alignItems:'center',justifyContent:'space-between' }}>
                <h3 style={{ width: '20%', display: 'inline-block'}} >{player02}</h3>
                <div style={{display: 'flex'}}>
                    {loadGameCards}
                </div>
                <h3 style={{ width: '20%', display: 'inline-block', textAlign: 'center' }}>{player04}</h3>
            </div> */}

