import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ChangeNameScreen from "./ChangeNameScreen";
import { UserContext } from '../../contexts/UserContext';

// Mock the UserContext
const mockUserContextValue = {
	user: {
		user_id: "1",
		user_name: "TestUser"
	}
};

// Define a custom context provider for testing
const MockUserContextProvider = ({ children }) => {
	return (
		<UserContext.Provider value={mockUserContextValue}>
			{children}
		</UserContext.Provider>
	);
};

describe('ChangeNameScreen', () => {
	it('should render ChangeNameScreen with title and screen items correctly', () => {    
		render(
			<MockUserContextProvider>
				<ChangeNameScreen />
			</MockUserContextProvider>
		);

		const screenTitle = screen.getByText(/Change Username./i);
		expect(screenTitle).toBeInTheDocument();

		const currentText = screen.getByText(/Current:/i);
		expect(currentText).toBeInTheDocument();

		const newText = screen.getByText(/New:/i);
		expect(newText).toBeInTheDocument();

		const buttonText = screen.getByRole('button', { name: /Change/i });
		expect(buttonText).toHaveTextContent('Change');
	});
});
