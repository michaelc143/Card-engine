import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import GameBoard from './GameBoard';
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

describe('GameBoard', () => {
    it('renders loading screen while game data is being fetched', () => {
        render(
            <MockUserContextProvider>
                <GameBoard selectedGameID="123" />
            </MockUserContextProvider>
        );
        const loadingText = screen.getByText('Loading...');
        expect(loadingText).toBeInTheDocument();
    });
});
