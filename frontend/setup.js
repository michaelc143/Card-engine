import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { createRoot } from 'react-dom/client';

// Create a root element before running the tests
const root = document.createElement('div');
root.setAttribute('id', 'root');
document.body.appendChild(root);

// Create a root renderer
window.root = createRoot(root);


afterEach(() => {
  cleanup();
});