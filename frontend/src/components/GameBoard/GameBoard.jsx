import { useEffect, useState, useRef, useContext } from 'react';
import { Client } from '@stomp/stompjs';
import './GameBoard.css';
import { UserContext } from '../../contexts/UserContext';

const GameBoard = ({ selectedGameID }) => {

	const { user } = useContext(UserContext);
	const [cards, setCards] = useState([]); // cards
	const [gameData, setGameData] = useState(null); // game data received from websocket
	const [score, setScore] = useState(0);
	const [currentTricks, setCurrentTricks] = useState([]);
	const stompRef = useRef(null); // reference to stomp client to call funcs outside of original useEffect

	// Connect to websocket and subscribe to game topic and hand topic
	useEffect(() => {
		const stompClient = new Client({
			brokerURL: 'ws://localhost:8080/full-house-bucky-websocket',
			debug: (str) => {
				console.log(str)
			},
			reconnectDelay: 5000, // Automatically reconnect after 5 seconds if the connection is lost
			heartbeatIncoming: 4000, // Expected heartbeat interval from the server (in milliseconds)
			heartbeatOutgoing: 4000, // Outgoing heartbeat interval (in milliseconds)
			onConnect: () => {
				stompRef.current = stompClient;
				// resubscribe to the game topic
				stompClient.subscribe(`/topic/games/euchre/${selectedGameID}`, (message) => {
					console.log(JSON.parse(message.body)); // logging websocketMessage
					setGameData(JSON.parse(message.body));
				}, (error) => {
					console.error('Error subscribing to topic:', error);
				});
				// subscribe to hand topic to privately get card hand data
				stompClient.subscribe(`/user/queue/${selectedGameID}/hand`, (message) => {
					console.log(JSON.parse(message.body));
					const receivedCards = JSON.parse(message.body);
					const cards = Object.entries(receivedCards).map(([cardName, isPlayable]) => ({
						name: cardName,
						isPlayable,
					}));
					setCards(cards);
				});
				// grab hand on initial component load
				stompClient.publish({
					destination: `/app/games/euchre/${selectedGameID}/${user.user_id}/request-hand`,
					body: user.user_id,
				});
			}
		});
		stompClient.activate();
	}, [selectedGameID, user.user_id]);

	// Request hand and update score when gameData is updated
	useEffect(() => {
		const stompClient = stompRef.current;
		if (stompClient && gameData) {
			stompClient.publish({
				destination: `/app/games/euchre/${selectedGameID}/${user.user_id}/request-hand`,
				body: user.user_id,
			});
		
			if (gameData.players && Array.isArray(gameData.players)) { // Check if players array exists and is an array
				const player = gameData.players.find(player => player.playerID === user.user_id);
				if (player !== undefined) {
					setScore(player.score);
				}
			}
			if (gameData.currentTrick && Array.isArray(gameData.currentTrick)) { // Check if currentTrick array exists and is an array
				const currentTricks = gameData.currentTrick.filter(trick => trick !== null);
				setCurrentTricks(currentTricks);
			}
		}
	},[gameData, selectedGameID, user.user_id]);

	// Loading screen for while game data is being grabbed originally
	if(!gameData) {
		return <h1>Loading...</h1>
	}

	// Make move to send what move you want to play to backend
	const makeMoveYesNo = (move) => {
		const stompClient = stompRef.current;
		if (stompClient) {
			stompClient.publish({
				destination: `/app/games/euchre/${selectedGameID}/${user.user_id}/make-move`,
				body: move,
			});
		}
	}

	/**
	 * Renders a game board component.
	 * @param {Array} cards - An array of cards to be displayed.
	 * @param {boolean} isCurrentPlayer - Indicates if the current player is the user.
	 * @param {Object} gameData - Data related to the game.
	 * @param {string} gameData.message - A message related to the game.
	 * @param {Array} gameData.options - An array of options available for the current player.
	 * @param {Function} makeMoveYesNo - A function to handle the player's move.
	 */
	return (
		gameData.status == "Ended" ? 
		(
			<div className='win-screen'>
				<h3>Game over</h3>
				<h3>Winners:</h3>
					{gameData.winners && gameData.winners.map((winner, index) => (
						<p key={index}>{winner.username}</p>
					))}
			</div>
		)
		:
		(
			<div>
				<div className='game-board-data'>
					<h3>Game Board</h3>
					<p>Score: {score} {gameData.trump !== null ? ", Trump: " + gameData.trump : ''} {gameData.upCard !== null ? ", UpCard: " + gameData.upCard : ''}</p>
				</div>
				<div className='container'>
					<div className="column">
						<h3>Current Tricks:</h3>
							{currentTricks !== null && gameData.phase == "PLAY_CARD" && currentTricks.map((trick, index) => (
								<p key={index}>
									{trick.suit} - {trick.rank}
								</p>
							))}
					</div>
					<div className="column">
						<h3>Current Hand:</h3>
						{cards.length > 0 ? 
							cards.map((card, index) => (
								<div key={index}>
									<p>Card: {card.name}</p>
								</div>
							))
						:
							<p>No cards</p>
						}
					</div>
				</div>
				<div className="msgAndOptions">
					<p>{gameData.message}</p>
				</div>
				<div className="options-container">
					{
						gameData.currentPlayer.playerID === user.user_id &&
						<>
							{gameData.options.map((option, index) => (
								<button onClick={() => makeMoveYesNo(option)} key={index}>{option}</button>
							))}
						</>
					}
				</div>
			</div>
		)
	);
};

export default GameBoard;