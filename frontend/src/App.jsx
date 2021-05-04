import React, { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Route,
  Switch,
  Redirect,
  useParams
} from 'react-router-dom';

import Home from './Home';
import './App.css';

const SetAuthToken = () => {
  const { token } = useParams();

  fetch(`${process.env.REACT_APP_SERVER_URL}/auth/token`, {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({token}),
  })
  .then(() => window.location.assign('/'));

  return <p>Loading...</p>;
};

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

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Home user={user} />
        </Route>
        <Route path="/auth/login/:token" component={SetAuthToken} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
