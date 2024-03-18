import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Login from './Login';

describe('Login', () => {
	it('renders the login box', () => {
		render(<Login />);
		const loginBox = screen.getByTestId('login-box');
		expect(loginBox).toBeInTheDocument();
	});

	it('displays the correct initial state', () => {
		render(<Login />);
		const usernameInput = screen.getByPlaceholderText('Username');
		expect(usernameInput).toHaveValue('');
	});

	it('updates the username input field', () => {
		render(<Login />);
		const usernameInput = screen.getByPlaceholderText('Username');
		fireEvent.change(usernameInput, { target: { value: 'testuser' } });
		expect(usernameInput).toHaveValue('testuser');
	});

	it('shows the new? text above the toggle btn', () => {
		render(<Login />);
		const pageTitle = screen.getAllByText(/New?/i);
		expect(pageTitle.length).toBeGreaterThan(0);
	});

	it('shows the button to switch to register screen', () => {
		render(<Login />);
		const swapButtonText = screen.getByRole('button', { name: /Sign up/i });
		expect(swapButtonText).toBeInTheDocument();
	});
    
	it('calls the onLogin callback with the correct username when login button is clicked', () => {
		const onLoginMock = vi.fn();
		render(<Login onLogin={onLoginMock} />);
		const usernameInput = screen.getByPlaceholderText('Username');
		const loginButton = screen.getByRole('button', { name: 'Login' });

		fireEvent.change(usernameInput, { target: { value: 'testuser' } });
		fireEvent.click(loginButton);

		expect(onLoginMock).toHaveBeenCalledWith('testuser', true);
	});
});