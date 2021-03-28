import React from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
  Link,
} from 'react-router-dom';

import Example from './Example';
import styles from './App.module.css';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/'>
          <Home />
        </Route>
        <Route path='/example'>
          <Example />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

function Home() {
  return (
    <div className={styles.app}>
      <h1>SMERN</h1>
      <p>
        Deploy a MERN app, <em>serverlessly</em>
      </p>
      <Link to='/example'>
        Example &rarr;
      </Link>
      <p>Documentation (coming soon)</p>
    </div>
  );
}

export default App;
