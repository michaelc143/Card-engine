import React from "react";

import { render, screen } from '@testing-library/react';

import SettingScreen from "./SettingScreen";



describe('SettingScreen', () => {

  it('should render Setting screen with title and screen items correctly', () => {	

	render(<SettingScreen />);

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