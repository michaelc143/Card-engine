import { render, screen } from '@testing-library/react';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import SelectSeat from './SelectSeat';

const mockShowToast = vi.fn();
const mockCloseModal = vi.fn();
const mockOpenLobbyScreenModal = vi.fn();

describe('SelectSeat', () => {
	const selectedGameId = '1234';
	const userID = 'user1';

	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('should render loading indicator when gameInfo is null', () => {
		render(<SelectSeat showToast={mockShowToast} closeModal={mockCloseModal} selectedGameId={selectedGameId} openLobbyScreenModal={mockOpenLobbyScreenModal} userID={userID} />);
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

		vi.spyOn(window, 'fetch').mockResolvedValueOnce({
			ok: true,
			json: vi.fn().mockResolvedValueOnce(gameInfo),
		});

		render(<SelectSeat showToast={mockShowToast} closeModal={mockCloseModal} selectedGameId={selectedGameId} openLobbyScreenModal={mockOpenLobbyScreenModal} userID={userID} />);

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

		vi.spyOn(window, 'fetch').mockResolvedValueOnce({
			ok: true,
			json: vi.fn().mockResolvedValueOnce(gameInfo),
		});

		render(<SelectSeat showToast={mockShowToast} closeModal={mockCloseModal} selectedGameId={selectedGameId} openLobbyScreenModal={mockOpenLobbyScreenModal} userID={userID} />);

		expect(await screen.findByText('Select Seat 2')).toBeInTheDocument();
		expect(await screen.findByText('Select Seat 3')).toBeInTheDocument();
	});

});