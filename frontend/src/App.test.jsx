import { render, screen, fireEvent } from '@testing-library/react';
import App from "./App";

describe('App', () => {
	it('renders page title', () => {
		render(<App />);
		const pageTitle = screen.getAllByText(/Welcome to Card engine!/i);
		expect(pageTitle.length).toBeGreaterThan(0);
	});

	it('renders login component when not logged in and not registering', () => {
		render(<App />);
		const loginComponent = screen.getByText(/Doesn't seem like you're logged in!/i);
		expect(loginComponent).toBeInTheDocument();
	});

	it('toggles between login and registration modes', () => {
		render(<App />);
		const toggleButton = screen.getByRole('button', { name: /New player\? Register Here/i });
		expect(toggleButton).toBeInTheDocument();
	
		fireEvent.click(toggleButton);
		const updatedButtonText = screen.getByRole('button', { name: /Already have a login\? Login Here/i });
		expect(updatedButtonText).toBeInTheDocument();
	
		fireEvent.click(updatedButtonText);
		const originalButtonText = screen.getByRole('button', { name: /New player\? Register Here/i });
		expect(originalButtonText).toBeInTheDocument();
	});
});