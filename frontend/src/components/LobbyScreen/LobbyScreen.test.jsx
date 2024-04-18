import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LobbyScreen from './LobbyScreen';

describe('LobbyScreen', () => {
	it('should render Lobby title player names correctly', async () => {
		const mockedData = {
			player1_name: "Player 1",
			player2_name: "Player 2",
			player3_name: null,
			player4_name: "Player 4",
		};

		const originalFetch = window.fetch;  // Store original fetch function

		window.fetch = async () => { // Mock fetch
			return {
				ok: true,
				json: () => mockedData,
			};
		};

		render(<LobbyScreen selectedGameId="123" />); // Provide selectedGameId

		await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for rendering

		const lobbyTitle = screen.getByText(/Lobby\./i); // Lobby Title
		expect(lobbyTitle).toBeInTheDocument();

		const playerNames = screen.getAllByText(/Player /i); // Find all player names, need the space because of Players title
		console.log(playerNames);
		expect(playerNames.length).toBe(3); // Expect 3 players (excluding null)

		window.fetch = originalFetch; // Restore original fetch function
	});
});
