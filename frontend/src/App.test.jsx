import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from "./App";

describe('App', () => {
	it('renders page title', () => {
		render(<App />);
		const pageTitle = screen.getAllByText(/Eucre/i);
		expect(pageTitle.length).toBeGreaterThan(0);
	});

	it('renders login component when not logged in and not registering', () => {
		render(<App />);
		const loginComponent = screen.getByText(/Login:/i);
		expect(loginComponent).toBeInTheDocument();
	});

	it('toggles between login and registration modes', () => {
		render(<App />);

		const loginText = screen.getByText(/Login:/i);
		expect(loginText).toBeInTheDocument();

		const toggleButton = screen.getByRole('button', { name: /Sign up/i });
		expect(toggleButton).toBeInTheDocument();
	
		fireEvent.click(toggleButton);

		const registerText = screen.getByText(/Register:/i);
		expect(registerText).toBeInTheDocument();

		const closeButton = screen.getByAltText('Close');
		expect(closeButton).toBeInTheDocument();
	
		fireEvent.click(closeButton);
		
		const originalButtonText = screen.getByRole('button', { name: /Sign up/i });
		expect(originalButtonText).toBeInTheDocument();
	});
});