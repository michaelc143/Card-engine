import { useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';

const GameBoard = ({ userID, selectedGameID, username }) => {

	const [cards, setCards] = useState([]);
	const [gameData, setGameData] = useState(null);
	const stompRef = useRef(null);

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
				// console.log('STOMP client connected');
				stompRef.current = stompClient;
				stompClient.subscribe(`/topic/games/euchre/${selectedGameID}`, (message) => {
					console.log(JSON.parse(message.body)); // logging websocketMessage
					setGameData(JSON.parse(message.body));
				}, (error) => {
					console.error('Error subscribing to topic:', error);
				});
				stompClient.subscribe(`/user/queue/${selectedGameID}/hand`, (message) => {
                    console.log(JSON.parse(message.body));
                    const receivedCards = JSON.parse(message.body);
					const cards = Object.entries(receivedCards).map(([cardName, isPlayable]) => ({
						name: cardName,
						isPlayable,
					}));
					setCards(cards);
                });
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
			{
				isCurrentPlayer &&
				<>
					<p>{gameData.message}</p>
					{gameData.options.map((option, index) => (
						<button onClick={() => makeMoveYesNo(option)} key={index}>{option}</button>
					))}
				</>
			}
		</div>
	);
};

export default GameBoard;