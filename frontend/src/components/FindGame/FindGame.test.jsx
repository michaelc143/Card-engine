import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import FindGame from './FindGame';

describe('FindGame', () => { 
    it('should have the text find game', () => {
		render(<FindGame />);
        const title = screen.getByText(/Find Game./i);
		expect(title).toBeInTheDocument();
	});

	it('should have the close svg', () => {
        render(<FindGame />);
        const closeSVG = screen.getByAltText('close');
    });
});