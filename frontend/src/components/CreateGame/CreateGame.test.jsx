import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import CreateGame from './CreateGame';
import { UserContext } from '../../contexts/UserContext';

// Mock the context used in CreateGame
const mockContextValue = {
	user: {
		user_id: 'user123',
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

// Define tests
describe('CreateGame', () => {
	const closeModalMock = vi.fn();
	const showToastMock = vi.fn();

	beforeEach(() => {
		// Render CreateGame within the MockContextProvider
		render(
		<MockContextProvider>
			<CreateGame closeModal={closeModalMock} showToast={showToastMock}/>
		</MockContextProvider>
		);
	});

	// Your test cases go here
	it('should render the component with the correct title', () => {
		const titleElement = screen.getByText(/Create Game./i);
		expect(titleElement).toBeInTheDocument();
	});

	it('should render the close button', () => {
		const closeButton = screen.getByAltText('close');
		expect(closeButton).toBeInTheDocument();
	});

	it('should call the closeModal function when the close button is clicked', () => {
		const closeButton = screen.getByAltText('close');
		fireEvent.click(closeButton);
		expect(closeModalMock).toHaveBeenCalled();
	});

	it('should render the game name input field', () => {
		const gameNameInput = screen.getByPlaceholderText('Name');
		expect(gameNameInput).toBeInTheDocument();
	});

	it('should update the game name state when typing in the input field', () => {
		const gameNameInput = screen.getByPlaceholderText('Name');
		fireEvent.change(gameNameInput, { target: { value: 'Test Game' } });
		expect(gameNameInput).toHaveValue('Test Game');
	});

	it('should render the private checkbox', () => {
		const privateCheckbox = screen.getByRole('checkbox');
		expect(privateCheckbox).toBeInTheDocument();
	});

	it('should toggle the private checkbox state when clicked', () => {
		const privateCheckbox = screen.getByRole('checkbox');
		fireEvent.click(privateCheckbox);
		expect(privateCheckbox).toBeChecked();
	});

	it('should render the password input field when the private checkbox is checked', () => {
		const privateCheckbox = screen.getByRole('checkbox');
		fireEvent.click(privateCheckbox);
		const passwordInput = screen.getByPlaceholderText('Password');
		expect(passwordInput).toBeInTheDocument();
	});

	it('should update the password state when typing in the input field', () => {
		const privateCheckbox = screen.getByRole('checkbox');
		fireEvent.click(privateCheckbox);
		const passwordInput = screen.getByPlaceholderText('Password');
		fireEvent.change(passwordInput, { target: { value: 'testpassword' } });
		expect(passwordInput).toHaveValue('testpassword');
	});

	it('should render the max players dropdown', () => {
		const dropdown = screen.getByLabelText('Max human players:');
		expect(dropdown).toBeInTheDocument();
	});
	
	it('should update the max players state when selecting a different value from the dropdown', () => {
		const dropdown = screen.getByLabelText('Max human players:');
		fireEvent.change(dropdown, { target: { value: '2' } });
		expect(dropdown).toHaveValue('2');
	});

	it('should render the "Create new game" button', () => {
		const createGameButton = screen.getByRole('button', { name: 'Create new game >' });
		expect(createGameButton).toBeInTheDocument();
	});

	it('should show an error toast when game name is empty', () => {
		const createGameButton = screen.getByRole('button', { name: 'Create new game >' });
		fireEvent.click(createGameButton);
		expect(showToastMock).toHaveBeenCalledWith('Game name is required', 'error');
	});
});
