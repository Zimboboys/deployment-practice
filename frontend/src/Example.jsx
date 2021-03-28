import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Example.module.css';

function Example() {
  const [count, setCount] = useState(0);
  const [session, ] = useState(Math.floor(Math.random() * 1000000));

  // get current count
  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/sum`)
      .then((res) => res.json())
      .then((data) => setCount(data.sum));
  }, []);

  const updateCount = () => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/push`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ session: session }),
    })

    setCount(count + 1);
  }

  return (
    <div className={styles.layout}>
      <h1>Example</h1>
      <p>{count}</p>
      <button onClick={updateCount} className={styles.button}>Click me</button>

      <div className={styles.desc}>
        <h3>What is this?</h3>
        <p>
          When you click the button, the number goes up. That number is the total
          amount of times that button has been pressed.
        </p>
        <p>
          I know it's not too impressive. This is just to highlight that the
          deployment process is working.
        </p>
      </div>

      <Link to='/'>Home &rarr;</Link>
    </div>
  );
}

export default Example;
