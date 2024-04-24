import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LobbyScreen from './LobbyScreen';

// Mock the WebSocket connection
vi.mock('@stomp/stompjs', () => ({
	Client: vi.fn().mockImplementation(() => ({
		activate: vi.fn(),
		subscribe: vi.fn((topic, callback) => {
		// Simulate the WebSocket message
		const mockMessage = {
			body: JSON.stringify({
			status: 'LOBBY',
			players: [
				{ playerID: 1, username: 'Player 1', readyToStart: true, score: 0, hand: [] },
				{ playerID: 2, username: 'Player 2', readyToStart: false, score: 0, hand: [] },
				null,
				{ playerID: 4, username: 'Player 4', readyToStart: true, score: 0, hand: [] },
			],
			}),
		};
		callback(mockMessage);
	}),
	publish: vi.fn(),
  })),
}));

describe('LobbyScreen', () => {
	it('should render Lobby title, player names, and static text correctly', async () => {
		render(<LobbyScreen selectedGameId="123" username="Player 1" userID={1} />);

		// Wait for the WebSocket message to be processed
		await waitFor(() => expect(screen.getByText('Lobby.')).toBeInTheDocument());

		const playersText = screen.getByText('Players:');
		expect(playersText).toBeInTheDocument();

		const readyText = screen.getByText('Ready:');
		expect(readyText).toBeInTheDocument();

		const startWithBotsText = screen.getByText('Your game will start filled with bots.');
		expect(startWithBotsText).toBeInTheDocument();
	});
});