import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import GameMenu from './GameMenu';

describe('GameMenu', () => { 

	const mockOpenfindGameModal = vi.fn();
	const mockClosefindGameModal = vi.fn();
	const mockOpenCreateGameModal = vi.fn();
	const mockCloseCreateGameModal = vi.fn();
	const mockShowToast = vi.fn();

	it('should have the text menu', () => {
		render(
			<GameMenu
				openfindGameModal={mockOpenfindGameModal}
				closefindGameModal={mockClosefindGameModal}
				findGameModalIsOpen={false}
				openCreateGameModal={mockOpenCreateGameModal}
				closeCreateGameModal={mockCloseCreateGameModal}
				createGameModalIsOpen={false}
				showToast={mockShowToast}
				userID={1}
			/>
		);
		const title = screen.getByText(/Menu./i);
		expect(title).toBeInTheDocument();
	});
	
	it('should have the profile and settings svgs', () => {
		render(
			<GameMenu
				openfindGameModal={mockOpenfindGameModal}
				closefindGameModal={mockClosefindGameModal}
				findGameModalIsOpen={false}
				openCreateGameModal={mockOpenCreateGameModal}
				closeCreateGameModal={mockCloseCreateGameModal}
				createGameModalIsOpen={false}
				showToast={mockShowToast}
				userID={1}
			/>
		);
		const accountSVG = screen.getByAltText('account');
		expect(accountSVG).toBeInTheDocument();
		const settingsSVG = screen.getByAltText('settings');
		expect(settingsSVG).toBeInTheDocument();
	});
	
	it('should have the find and create game texts', () => {
		render(
			<GameMenu
				openfindGameModal={mockOpenfindGameModal}
				closefindGameModal={mockClosefindGameModal}
				findGameModalIsOpen={false}
				openCreateGameModal={mockOpenCreateGameModal}
				closeCreateGameModal={mockCloseCreateGameModal}
				createGameModalIsOpen={false}
				showToast={mockShowToast}
				userID={1}
			/>
		);
		const findGame = screen.getByText(/Find Game/i);
		expect(findGame).toBeInTheDocument();
		const createGame = screen.getByText(/Create Game/i);
		expect(createGame).toBeInTheDocument();
	});

	it('should open the FindGame modal when clicking the "Find Game" button', () => {
		render(
			<GameMenu
				openfindGameModal={mockOpenfindGameModal}
				closefindGameModal={mockClosefindGameModal}
				findGameModalIsOpen={false}
				openCreateGameModal={mockOpenCreateGameModal}
				closeCreateGameModal={mockCloseCreateGameModal}
				createGameModalIsOpen={false}
				showToast={mockShowToast}
				userID={1}
			/>
		);

		const findGameButton = screen.getByText(/Find Game/i);
		fireEvent.click(findGameButton);
		expect(mockOpenfindGameModal).toHaveBeenCalled();
	});

	it('should open the CreateGame modal when clicking the "Create Game" button', () => {
		render(
			<GameMenu
				openfindGameModal={mockOpenfindGameModal}
				closefindGameModal={mockClosefindGameModal}
				findGameModalIsOpen={false}
				openCreateGameModal={mockOpenCreateGameModal}
				closeCreateGameModal={mockCloseCreateGameModal}
				createGameModalIsOpen={false}
				showToast={mockShowToast}
				userID={1}
			/>
		);

		const createGameButton = screen.getByText(/Create Game/i);
		fireEvent.click(createGameButton);
		expect(mockOpenCreateGameModal).toHaveBeenCalled();
	});
});