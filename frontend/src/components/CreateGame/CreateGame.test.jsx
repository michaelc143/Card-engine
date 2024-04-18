import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import CreateGame from './CreateGame';

describe('CreateGame', () => { 
	const closeModalMock = vi.fn();

	beforeEach(() => {
		render(<CreateGame closeModal={closeModalMock} />);
	});

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
});