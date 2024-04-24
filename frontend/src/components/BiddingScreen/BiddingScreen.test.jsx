import React from "react";

import { render, screen } from '@testing-library/react';

import BiddingScreen from "./BiddingScreen";



describe('BiddingScreen', () => {

  it('should render Bidding screen with title and screen items correctly', () => {	

	render(<BiddingScreen />);

	const screenTitle = screen.getByText(/Bidding./i);
	expect(screenTitle).toBeInTheDocument();

	const candidatesuite = screen.getByText(/The candidate suit is:/i);
	expect(candidatesuite).toBeInTheDocument();

	const pickitup = screen.getByText(/Pick it up/i);
	expect(pickitup).toBeInTheDocument();

	const PassText = screen.getByText(/Pass/i);
	expect(PassText).toBeInTheDocument();    
    
  });


});