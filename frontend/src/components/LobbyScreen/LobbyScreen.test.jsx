import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LobbyScreen from './LobbyScreen'; // Import the component
import { UserContext } from '../../contexts/UserContext';

// Mock context value
const mockContextValue = {
    username: 'Player 1',
    user_id: 1
};

// Define a custom context provider for testing
const MockContextProvider = ({ children }) => {
    return (
        <UserContext.Provider value={mockContextValue}>
            {children}
        </UserContext.Provider>
    );
};

describe('LobbyScreen', () => {
    it('should render Lobby title, player names, and static text correctly', async () => {
        // Render LobbyScreen component within MockContextProvider
        render(
            <MockContextProvider>
                <LobbyScreen />
            </MockContextProvider>
        );

        // Wait for the WebSocket message (if applicable)
        await waitFor(() => expect(screen.getByText('Lobby.')).toBeInTheDocument());

        // Assert that Lobby title, player names, and static text are rendered correctly
        const playersText = screen.getByText('Players:');
        expect(playersText).toBeInTheDocument();

        const readyText = screen.getByText('Ready:');
        expect(readyText).toBeInTheDocument();

        const startWithBotsText = screen.getByText('Your game will start filled with bots.');
        expect(startWithBotsText).toBeInTheDocument();
    });
});
