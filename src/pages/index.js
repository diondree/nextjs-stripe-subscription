import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';

const STATES = {
  INITIAL: 'initial',
  LOADING: 'loading',
  READY: 'ready',
  ERROR: 'error',
};

export default function Home() {
  const [plans, setPlans] = useState();
  const [state, setState] = useState(STATES.INITIAL);

  useEffect(async () => {
    try {
      setState(STATES.LOADING);
      const result = await fetch('http://localhost:8080/api/plans', {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await result.json();
      console.log(data);
      setPlans(data);
      setState(STATES.READY);
    } catch (err) {
      console.log(err);
      setState(STATES.ERROR);
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className="togethere-background"></div>
      <div className="sr-root">
        <div className="sr-main">
          <header className="sr-header">
            <div className="sr-header__logo"></div>
          </header>
          <h1>Choose a payment plan</h1>

          <div className="price-table-container">
            {state === STATES.LOADING && <div>Loading Plans</div>}
            {state === STATES.READY &&
              plans.map((plan) => (
                <section>
                  <img src="/img/starter.png" width="120" height="120" />
                  <div className="name">Monthly Plan</div>
                  <div className="price">${plan.price / 100}</div>
                  <div className="duration">per month</div>
                  <Link href={`/checkout?pId=${plan.id}`}>
                    <button>Select</button>
                  </Link>
                </section>
              ))}
            {/**<section>
              <img src="/img/professional.png" width="120" height="120" />
              <div className="name">Professional</div>
              <div className="price">$20</div>
              <div className="duration">per month</div>
              <button id="pro-plan-btn">Select</button>
            </section>**/}
          </div>
        </div>
      </div>
    </div>
  );
}
