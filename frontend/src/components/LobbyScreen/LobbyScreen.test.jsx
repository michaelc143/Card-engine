import React from "react";
import { render, screen } from '@testing-library/react';
import LobbyScreen from './LobbyScreen';

describe('LobbyScreen', () => {
  it('should render username and player names correctly', () => {
	const username = 'TestUser';
	const playerNames = ['Me.', 'Player2 (bot)', 'Player3 (bot)', 'Player4 (bot)'];

	render(<LobbyScreen username={username} />);

	const lobbyTitle = screen.getByText(/Lobby./i);
	expect(lobbyTitle).toBeInTheDocument();


	playerNames.forEach(name => {
		const playerNameElement = screen.getByText(name);
		expect(playerNameElement).toBeInTheDocument();
	});

	const startButton = screen.getByText(/Start game/i);
	expect(startButton).toBeInTheDocument();
  });
});
