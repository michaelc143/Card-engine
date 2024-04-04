import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import GameMenu from './gameMenu';

describe('GameMenu', () => { 
	it('should have the text menu', () => {
		render(<GameMenu />);
		const title = screen.getByText(/Menu./i);
		expect(title).toBeInTheDocument();
	});

	it('should have the profile and settings svgs', () => {
		render(<GameMenu />);
		const accountSVG = screen.getByAltText('account');
		expect(accountSVG).toBeInTheDocument();
		const settingsSVG = screen.getByAltText('settings');
		expect(settingsSVG).toBeInTheDocument();
	});

	it('should have the find and create game texts', () => {
		render(<GameMenu />);
		const findGame = screen.getByText(/Find Game/i);
		expect(findGame).toBeInTheDocument();
		const createGame = screen.getByText(/Create Game/i);
		expect(createGame).toBeInTheDocument();
	});
});