import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FindGame from './FindGame';

describe('FindGame', () => {
	it('should render with the text "Find Game."', async () => {
		const mockedData = {}; // Mocked data for open games

		const originalFetch = window.fetch; // Store original fetch function

		window.fetch = async () => { // Mock fetch
			return {
				ok: true,
				json: () => mockedData,
			};
		};

		render(<FindGame />);

		await new Promise(resolve => setTimeout(resolve, 0)); // Wait for rendering

		const title = screen.getByText(/Find Game./i);
		expect(title).toBeTruthy();

		window.fetch = originalFetch; // Restore original fetch function
	});

	it('should render with the close button image', async () => {
		const mockedData = {}; // Mocked data for open games

		const originalFetch = window.fetch; // Store original fetch function

		window.fetch = async () => { // Mock fetch
			return {
				ok: true,
				json: () => mockedData,
			};
		};

		render(<FindGame />);

		await new Promise(resolve => setTimeout(resolve, 0)); // Wait for rendering

		const closeSVG = screen.getByAltText('close');
		expect(closeSVG).toBeTruthy();

		window.fetch = originalFetch; // Restore original fetch function
	});

	it('should render open game data', async () => {
		const mockedOpenGames = {
			"Game 1": {
				game_id: 1,
				number_players: 2
			},
			"Game 2": {
				game_id: 2,
				number_players: 3
			},
			"Game 3": {
				game_id: 3,
				number_players: 1
			}
		};

		const originalFetch = window.fetch; // Store original fetch function

		window.fetch = async () => { // Mock fetch
			return {
				ok: true,
				json: () => mockedOpenGames,
			};
		};

		render(<FindGame />);

		await new Promise(resolve => setTimeout(resolve, 0)); // Wait for rendering

		Object.entries(mockedOpenGames).forEach(([gameName, gameData]) => {
			expect(screen.getByText(text => text.includes(gameName))).toBeTruthy(); // Adjusted text matcher
			expect(screen.getByText(`${gameData.number_players}/4`)).toBeTruthy();
		});

		window.fetch = originalFetch; // Restore original fetch function
	});

	it('should call openSelectSeatModal when selecting a game', async () => {
		const mockedOpenGames = {
			"Game 1": {
				game_id: 1,
				number_players: 2
			},
			"Game 2": {
				game_id: 2,
				number_players: 3
			},
			"Game 3": {
				game_id: 3,
				number_players: 1
			}
		};

		const originalFetch = window.fetch; // Store original fetch function

		window.fetch = async () => { // Mock fetch
			return {
				ok: true,
				json: () => mockedOpenGames,
			};
		};

		const openSelectSeatModalMock = vi.fn(); // Create a mock function
		render(<FindGame openSelectSeatModal={openSelectSeatModalMock} />);

		await new Promise(resolve => setTimeout(resolve, 0)); // Wait for rendering

		// Get all buttons
		const selectButtons = screen.getAllByText('>');

		// Simulate clicking the button for each game
		selectButtons.forEach((button, index) => {
			button.click(); // Simulate click event
			expect(openSelectSeatModalMock).toHaveBeenCalledWith(mockedOpenGames[`Game ${index + 1}`].game_id);
		});
		window.fetch = originalFetch; // Restore original fetch function
	});
});