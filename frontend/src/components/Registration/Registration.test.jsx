import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
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
		const swapButtonText = screen.getByRole('button', { name: /Already have a login\? Login Here/i });
		expect(swapButtonText).toBeInTheDocument();
	});
    
	it('calls the onRegister callback with the correct username when login button is clicked', () => {
		const onRegisterMock = vi.fn();
		render(<Registration onRegister={onRegisterMock} />);
		const usernameInput = screen.getByPlaceholderText('Username');
		const registerButton = screen.getByRole('button', { name: 'Register' });

		fireEvent.change(usernameInput, { target: { value: 'testuser' } });
		fireEvent.click(registerButton);

		expect(onRegisterMock).toHaveBeenCalledWith('testuser', true);
	});
});