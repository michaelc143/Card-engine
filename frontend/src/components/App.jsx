import { useState } from 'react'
import './App.css'
import Login from './Login';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const handleLogin = (username, isLogged) => {
    setUsername(username); // Set the username in the state
    setLoggedIn(isLogged);
  };

  return (
    <div className='container'>
      <h1>Welcome to Card Engine!</h1>
      {loggedIn ? (
        <p>Welcome {username}!</p>
      ) : (
        <>
          <p>Doesn't seem like you're logged in!</p>
          <Login onLogin={handleLogin} />
        </>
      )}
    </div>
  );
}

export default App
