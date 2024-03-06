import { render, screen } from '@testing-library/react';
import App from "./App";

describe('App', () => {
    it('renders page title', () => {
        render(<App />);
        const pageTitle = screen.getAllByText(/Welcome to Card engine!/i);
        expect(pageTitle.length).toBeGreaterThan(0);
    });
});