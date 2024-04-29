import { useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';

const GameBoard = ({ userID, selectedGameID, username }) => {

	const [cards, setCards] = useState([]); // cards
	const [gameData, setGameData] = useState(null); // game data received from websocket
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
					destination: `/app/games/euchre/${selectedGameID}/${userID}/request-hand`,
					body: userID,
				});
			}
		});
		stompClient.activate();
	}, [selectedGameID, userID]);

	// Request hand when gameData is updated
	useEffect(() => {
		const stompClient = stompRef.current;
		if (stompClient) {
			stompClient.publish({
				destination: `/app/games/euchre/${selectedGameID}/${userID}/request-hand`,
				body: userID,
			});
		}
	},[gameData]);

	// Loading screen for while game data is being grabbed originally
	if(!gameData) {
		return <h1>Loading...</h1>
	}

	// Make move to send what move you want to play to backend
	const makeMoveYesNo = (move) => {
		const stompClient = stompRef.current;
		if (stompClient) {
			stompClient.publish({
				destination: `/app/games/euchre/${selectedGameID}/${userID}/make-move`,
				body: move,
			});
		}
	}

	// Check if it is the current player's turn (used to choose whether or not to display msg)
	const isCurrentPlayer = gameData.currentPlayer.playerID === userID;

	/**
	 * Renders a game board component.
	 * @param {string} username - The username of the player.
	 * @param {string} userID - The user ID of the player.
	 * @param {Array} cards - An array of cards to be displayed.
	 * @param {boolean} isCurrentPlayer - Indicates if the current player is the user.
	 * @param {Object} gameData - Data related to the game.
	 * @param {string} gameData.message - A message related to the game.
	 * @param {Array} gameData.options - An array of options available for the current player.
	 * @param {Function} makeMoveYesNo - A function to handle the player's move.
	 */
	return (
		<div>
			<h2>Game Board {username} {userID}</h2>
			{cards.length > 0 ? cards.map((card, index) => (
			<div key={index}>
				<p>Card: {card.name}, Playable: {card.isPlayable ? 'Yes' : 'No'}</p>
			</div>
			))
			:
			<p>No cards</p>}
			<p>{gameData.message}</p>
			{
				isCurrentPlayer &&
				<>
					{gameData.options.map((option, index) => (
						<button onClick={() => makeMoveYesNo(option)} key={index}>{option}</button>
					))}
				</>
			}
		</div>
	);
};

export default GameBoard;