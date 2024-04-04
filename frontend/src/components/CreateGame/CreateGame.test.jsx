import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import CreateGame from './CreateGame';

describe('CreateGame', () => { 
    it('should have the text create game', () => {
		render(<CreateGame />);
        const title = screen.getByText(/Create Game./i);
		expect(title).toBeInTheDocument();
	});
});