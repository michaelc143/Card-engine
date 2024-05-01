import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import GameMenu from './GameMenu';
import { UserContext } from '../../contexts/UserContext';

// Mock functions
const mockOpenfindGameModal = vi.fn();
const mockClosefindGameModal = vi.fn();
const mockOpenCreateGameModal = vi.fn();
const mockCloseCreateGameModal = vi.fn();
const mockShowToast = vi.fn();

// Mock context value
const mockContextValue = {
	user_id: 1,
	user_name: 'Test User'
};

// Define a custom context provider for testing
const MockContextProvider = ({ children }) => {
	return (
		<UserContext.Provider value={mockContextValue}>
			{children}
		</UserContext.Provider>
	);
};

describe('GameMenu', () => {
	it('should have the text menu', () => {
		// Render GameMenu component within MockContextProvider
		render(
			<MockContextProvider>
				<GameMenu
					openfindGameModal={mockOpenfindGameModal}
					closefindGameModal={mockClosefindGameModal}
					findGameModalIsOpen={false}
					openCreateGameModal={mockOpenCreateGameModal}
					closeCreateGameModal={mockCloseCreateGameModal}
					createGameModalIsOpen={false}
					showToast={mockShowToast}
				/>
			</MockContextProvider>
		);
		// Assert the title is rendered
		const title = screen.getByText(/Menu./i);
		expect(title).toBeInTheDocument();
	});

	it('should have the profile and settings svgs', () => {
		// Render GameMenu component within MockContextProvider
		render(
			<MockContextProvider>
				<GameMenu
				openfindGameModal={mockOpenfindGameModal}
				closefindGameModal={mockClosefindGameModal}
				findGameModalIsOpen={false}
				openCreateGameModal={mockOpenCreateGameModal}
				closeCreateGameModal={mockCloseCreateGameModal}
				createGameModalIsOpen={false}
				showToast={mockShowToast}
				/>
			</MockContextProvider>
		);
		// Assert profile and settings SVGs are rendered
		const accountSVG = screen.getByAltText('account');
		expect(accountSVG).toBeInTheDocument();
		const settingsSVG = screen.getByAltText('settings');
		expect(settingsSVG).toBeInTheDocument();
	});

	it('should have the find and create game texts', () => {
		// Render GameMenu component within MockContextProvider
		render(
			<MockContextProvider>
				<GameMenu
				openfindGameModal={mockOpenfindGameModal}
				closefindGameModal={mockClosefindGameModal}
				findGameModalIsOpen={false}
				openCreateGameModal={mockOpenCreateGameModal}
				closeCreateGameModal={mockCloseCreateGameModal}
				createGameModalIsOpen={false}
				showToast={mockShowToast}
				/>
			</MockContextProvider>
		);
		// Assert find and create game texts are rendered
		const findGame = screen.getByText(/Find Game/i);
		expect(findGame).toBeInTheDocument();
		const createGame = screen.getByText(/Create Game/i);
		expect(createGame).toBeInTheDocument();
	});

	it('should open the FindGame modal when clicking the "Find Game" button', () => {
		// Render GameMenu component within MockContextProvider
		render(
			<MockContextProvider>
				<GameMenu
				openfindGameModal={mockOpenfindGameModal}
				closefindGameModal={mockClosefindGameModal}
				findGameModalIsOpen={false}
				openCreateGameModal={mockOpenCreateGameModal}
				closeCreateGameModal={mockCloseCreateGameModal}
				createGameModalIsOpen={false}
				showToast={mockShowToast}
				/>
			</MockContextProvider>
		);
		// Simulate clicking the "Find Game" button
		const findGameButton = screen.getByText(/Find Game/i);
		fireEvent.click(findGameButton);
		// Assert that mockOpenfindGameModal has been called
		expect(mockOpenfindGameModal).toHaveBeenCalled();
	});

	it('should open the CreateGame modal when clicking the "Create Game" button', () => {
		// Render GameMenu component within MockContextProvider
		render(
			<MockContextProvider>
				<GameMenu
				openfindGameModal={mockOpenfindGameModal}
				closefindGameModal={mockClosefindGameModal}
				findGameModalIsOpen={false}
				openCreateGameModal={mockOpenCreateGameModal}
				closeCreateGameModal={mockCloseCreateGameModal}
				createGameModalIsOpen={false}
				showToast={mockShowToast}
				/>
			</MockContextProvider>
		);
		// Simulate clicking the "Create Game" button
		const createGameButton = screen.getByText(/Create Game/i);
		fireEvent.click(createGameButton);
		// Assert that mockOpenCreateGameModal has been called
		expect(mockOpenCreateGameModal).toHaveBeenCalled();
	});
});