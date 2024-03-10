# How to run the frontend

```bash
cd ./frontend
npm install
npm run dev
```

## How to run unit tests

```bash
cd ./frontend
npm test
```

Note: Unit test files should be placed in the same folder as the component JSX and CSS files.

## Project Structure

This project is layed out so that files that require one another are as close as possible. The main files to work with to develop the frontend are all contained within the src directory. Within the src directory, there are a few other directories to keep things clean.

* Components: Used to store components that can be used and reused across the project. There are directories for each component within this directory that stores their JSX file as well as their css styling file.
* Assets: Used to store static files such as images
* Main.jsx and App.jsx: Main.jsx is used to allow react to build the DOM tree using the App component as the entry point for the root element in index.html. App.jsx currently has basic login and registration functionality that requires the user to login/register themselves in order to view the home page.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
