import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import GameBoard from './GameBoard';

describe('GameBoard', () => {

    it('renders loading screen while game data is being fetched', () => {
        render(
            <GameBoard 
                userID="1" 
                selectedGameID="123" 
                username="TestUser" 
            />
        );
        const loadingText = screen.getByText('Loading...');
        expect(loadingText).toBeInTheDocument();
    });
});
