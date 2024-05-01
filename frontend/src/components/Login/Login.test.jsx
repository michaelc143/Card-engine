import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
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

	it('renders the login button with the > symbol', () => {
		render(<Login />);
		const loginButton = screen.getByRole('button', { name: />/i });
		expect(loginButton).toHaveTextContent('>');
	});

	it('calls the onLogin callback with the correct username when login button is clicked', () => {
		const onLoginMock = vi.fn();
		render(<Login onLogin={onLoginMock} />);
		const usernameInput = screen.getByPlaceholderText('Username');
		const loginButton = screen.getByRole('button', { name: />/i });

		fireEvent.change(usernameInput, { target: { value: 'testuser' } });
		fireEvent.click(loginButton);

		expect(onLoginMock).toHaveBeenCalledWith('testuser');
	});

	it('displays an error toast if username is not specified for login', () => {
		const showToastMock = vi.fn();
		render(<Login onLogin={() => {}} showToast={showToastMock} />);
		const loginButton = screen.getByRole('button', { name: />/i });

		fireEvent.click(loginButton);

		expect(showToastMock).toHaveBeenCalledWith('Username not specified for login', 'error');
	});
});