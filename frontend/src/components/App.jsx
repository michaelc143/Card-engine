import { useState } from 'react'
import '../styles/App.css'
import Login from './Login';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState(''); // Probably should use session storage to store login to persist through refreshes

  const handleLogin = (username, isLogged) => {
    setUsername(username); // Set the username in the state
    setLoggedIn(isLogged); // Set the user as logged in
  };

  return (
    <div className='container'>
      <h1>Welcome to Card Engine!</h1>
      {
      loggedIn ? 
        (
          <p>Welcome {username}!</p>
        ) 
        : 
        (
          <>
            <p>Doesn't seem like you're logged in!</p>
            <Login onLogin={handleLogin} />
          </>
        )
      }
    </div>
  );
}

export default App
