import React from "react";
import { render, screen } from '@testing-library/react';
import LobbyScreen from './LobbyScreen';

describe('LobbyScreen', () => {
  it('should render username and player names correctly', () => {
	const username = 'TestUser';
	const playerNames = ['Player2', 'Player3', 'Player4'];

	render(<LobbyScreen username={username} />);

	const lobbyTitle = screen.getByText(/Lobby./i);
	expect(lobbyTitle).toBeInTheDocument();

	const usernameElement = screen.getByText(username);
	expect(usernameElement).toBeInTheDocument();

	playerNames.forEach(name => {
		const playerNameElement = screen.getByText(name);
		expect(playerNameElement).toBeInTheDocument();
	});

	const startButton = screen.getByText(/Start game/i);
	expect(startButton).toBeInTheDocument();
  });
});
