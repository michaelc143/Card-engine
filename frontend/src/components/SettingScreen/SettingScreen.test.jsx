import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SettingScreen from "./SettingScreen";
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

describe('SettingScreen', () => {
	it('should render Setting screen with title and screen items correctly', () => {    
		render(
			<MockUserContextProvider>
				<SettingScreen />
			</MockUserContextProvider>
		);

		const screenTitle = screen.getByText(/Setting./i);
		expect(screenTitle).toBeInTheDocument();

		const changeusernameText = screen.getByText(/Change Username/i);
		expect(changeusernameText).toBeInTheDocument();

		const resetstatsText = screen.getByText(/Reset Stats/i);
		expect(resetstatsText).toBeInTheDocument();

		const deleteaccountText = screen.getByText(/Delete Account/i);
		expect(deleteaccountText).toBeInTheDocument();
	});
});
