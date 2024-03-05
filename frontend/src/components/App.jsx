import { useState } from 'react'
import '../styles/App.css'
import Login from './Login';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState(''); // Probably should use session storage to store login to persist through refreshes

  const handleLogin = (username, isLogged) => {
    // VERIFY USER HAS ACCOUNT BY SENDING REQUEST TO BACKEND TO LOGIN
    setUsername(username); // Set the username in the state
    setLoggedIn(isLogged); // Set the user as logged in
  };

  const handleRegister = (username) => {
    // SEND REGISTER REQUEST TO BACKEND TO CREATE NEW USER
    alert('Successfully registered ' + username + '!');
  }

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
            <Login onLogin={handleLogin} onRegister={handleRegister} />
          </>
        )
      }
    </div>
  );
}

export default App
