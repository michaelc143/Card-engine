import { render, screen } from '@testing-library/react';
import { describe, it, expect} from 'vitest';
import ChangeNameScreen from "./ChangeNameScreen";



describe('ChangeNameScreen', () => {

  it('should render ChangeNameScreen with title and screen items correctly', () => {	

	render(<ChangeNameScreen />);

	const screenTitle = screen.getByText(/Change Username./i);

	expect(screenTitle).toBeInTheDocument();



    const currentText = screen.getByText(/Current:/i);

	expect(currentText).toBeInTheDocument();



    const newText = screen.getByText(/New:/i);

	expect(newText).toBeInTheDocument();



    const buttonText = screen.getByRole('button', { name: /Change/i });

	expect(buttonText).toHaveTextContent('Change');


  });



});