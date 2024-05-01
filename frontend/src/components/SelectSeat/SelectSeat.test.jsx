import { render, screen } from '@testing-library/react';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import SelectSeat from './SelectSeat';
import { UserContext } from '../../contexts/UserContext';

// Mock functions
const mockShowToast = vi.fn();
const mockCloseModal = vi.fn();
const mockOpenLobbyScreenModal = vi.fn();

// Mock context value
const mockContextValue = {
	user: {
		user_id: 'user1',
		username: 'Test User'
	}
};

// Define a custom context provider for testing
const MockContextProvider = ({ children }) => {
	return (
		<UserContext.Provider value={mockContextValue}>
			{children}
		</UserContext.Provider>
	);
};

describe('SelectSeat', () => {
	const selectedGameId = '1234';

	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('should render loading indicator when gameInfo is null', () => {
		// Render SelectSeat component within the MockContextProvider
		render(
		<MockContextProvider>
			<SelectSeat
			showToast={mockShowToast}
			closeModal={mockCloseModal}
			selectedGameId={selectedGameId}
			openLobbyScreenModal={mockOpenLobbyScreenModal}
			/>
		</MockContextProvider>
		);
		// Assert loading indicator is rendered
		expect(screen.getByText('Loading...')).toBeInTheDocument();
	});

	it('should render game name and ID when gameInfo is available', async () => {
		const gameInfo = {
		game_name: 'Test Game',
		game_id: '1234',
		player1_name: 'Player 1',
		player2_name: null,
		player3_name: null,
		player4_name: 'Player 4',
		creation_date: '2023-05-01T00:00:00Z',
		};

		// Mock fetch function to return resolved value
		vi.spyOn(window, 'fetch').mockResolvedValueOnce({
			ok: true,
			json: vi.fn().mockResolvedValueOnce(gameInfo),
		});

		// Render SelectSeat component within the MockContextProvider
		render(
			<MockContextProvider>
				<SelectSeat
				showToast={mockShowToast}
				closeModal={mockCloseModal}
				selectedGameId={selectedGameId}
				openLobbyScreenModal={mockOpenLobbyScreenModal}
				/>
			</MockContextProvider>
		);

		// Assert game name and ID are rendered
		expect(await screen.findByText('Name: Test Game, ID: 1234')).toBeInTheDocument();
	});

	it('should render seat buttons for available seats', async () => {
		const gameInfo = {
		game_name: 'Test Game',
		game_id: '1234',
		player1_name: 'Player 1',
		player2_name: null,
		player3_name: null,
		player4_name: 'Player 4',
		creation_date: '2023-05-01T00:00:00Z',
		};

		// Mock fetch function to return resolved value
		vi.spyOn(window, 'fetch').mockResolvedValueOnce({
		ok: true,
		json: vi.fn().mockResolvedValueOnce(gameInfo),
		});

		// Render SelectSeat component within the MockContextProvider
		render(
		<MockContextProvider>
			<SelectSeat
			showToast={mockShowToast}
			closeModal={mockCloseModal}
			selectedGameId={selectedGameId}
			openLobbyScreenModal={mockOpenLobbyScreenModal}
			/>
		</MockContextProvider>
		);

		// Assert seat buttons are rendered
		expect(await screen.findByText('Select Seat 2')).toBeInTheDocument();
		expect(await screen.findByText('Select Seat 3')).toBeInTheDocument();
	});

});
