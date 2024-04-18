import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import Registration from './Registration';

describe('Registration', () => {
	it('renders the register box', () => {
		render(<Registration />);
		const registrationBox = screen.getByTestId('registration-box');
		expect(registrationBox).toBeInTheDocument();
	});

	it('displays the correct initial state', () => {
		render(<Registration />);
		const usernameInput = screen.getByPlaceholderText('Username');
		expect(usernameInput).toHaveValue('');
	});

	it('updates the username input field', () => {
		render(<Registration />);
		const usernameInput = screen.getByPlaceholderText('Username');
		fireEvent.change(usernameInput, { target: { value: 'testuser' } });
		expect(usernameInput).toHaveValue('testuser');
	});

	it('shows the button to switch to login screen', () => {
		render(<Registration />);
		const closeButton = screen.getByAltText('Close');
		expect(closeButton).toBeInTheDocument();
	});

	it('renders the register button with the > symbol', () => {
		render(<Registration />);
		const loginButton = screen.getByRole('button', { name: />/i });
		expect(loginButton).toHaveTextContent('>');
	});
	
	it('calls the onRegister callback with the correct username when login button is clicked', () => {
		const onRegisterMock = vi.fn();
		render(<Registration onRegister={onRegisterMock} />);
		const usernameInput = screen.getByPlaceholderText('Username');
		const registerButton = screen.getByRole('button', { name: />/i });

		fireEvent.change(usernameInput, { target: { value: 'testuser' } });
		fireEvent.click(registerButton);

		expect(onRegisterMock).toHaveBeenCalledWith('testuser');
	});
});