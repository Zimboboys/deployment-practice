import React, { useState, useEffect } from 'react';

import Home from './Home';
import './App.css';

function App() {
  const [user, setUser] = useState();

  useEffect(() => {
    const URL = `${process.env.REACT_APP_SERVER_URL}/auth/user`;
    fetch(URL, {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => setUser(data.user))
    .catch(err => console.error(err));
  }, []);

  return <Home user={user} />;
}

export default App;
