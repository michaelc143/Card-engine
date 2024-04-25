import { useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';

const GameBoard = ({ userID, selectedGameID }) => {

    const [cards, setCards] = useState(null);
    const stompRef = useRef(null);

    useEffect(() => {
        const stompClient = new Client({
            brokerURL: 'ws://localhost:8080/full-house-bucky-websocket',
            debug: (str) => {
                console.log(str);
            },
            reconnectDelay: 5000, // Automatically reconnect after 5 seconds if the connection is lost
            heartbeatIncoming: 4000, // Expected heartbeat interval from the server (in milliseconds)
            heartbeatOutgoing: 4000, // Outgoing heartbeat interval (in milliseconds)
            onConnect: () => {
                console.log('STOMP client connected');
                stompRef.current = stompClient;
                stompClient.subscribe(`/topic/games/euchre/${selectedGameID}`, (message) => {
                    console.log(JSON.parse(message.body)); // logging websocketMessage
                }, (error) => {
                    console.error('Error subscribing to topic:', error);
                });
                stompClient.subscribe(`/user/queue/${selectedGameID}/hand`, (message) => {
                    console.log(JSON.parse(message.body));
                    setCards(JSON.parse(message.body));
                });
                stompClient.publish({
                    destination: `/app/games/euchre/${selectedGameID}/${userID}/request-hand`,
                });
            }
        });
        stompClient.activate();
    }, []);

    const getCards = () => {
        const stompClient = stompRef.current;
        if (stompClient) {
            stompClient.publish({
                destination: `/app//games/euchre/${selectedGameID}/${userID}/request-hand`,
                body: userID,
            });
        }
    }


  return (
    <div>
        <h2>Game Board {userID}</h2>
        {cards && cards.map((card, index) => (
                <div key={index}>
                    <p>Card {index} Suit: {card.suit} Rank: {card.rank}</p>
                </div>
        ))}
    </div>
  );
};

export default GameBoard;