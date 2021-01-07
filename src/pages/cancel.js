import { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';

const STATES = {
  INITIAL: 'initial',
  LOADING: 'loading',
  READY: 'ready',
  FINISHED: 'finished',
  ERROR: 'error',
};

const CancelPage = () => {
  const [subscriptionId, setSubscriptionId] = useState();
  const [state, setState] = useState(STATES.INITIAL);

  const cancelSubscription = async () => {
    try {
      setState(STATES.LOADING);
      const response = await fetch(
        `http://localhost:8080/api/subscriptions/${subscriptionId}`,
        {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: 2,
          }),
        }
      );
      setState(STATES.FINISHED);
    } catch (err) {
      console.log(err);
      setState(STATES.ERROR);
    }
  };

  useEffect(async () => {
    try {
      setState(STATES.LOADING);
      const response = await fetch(
        'http://localhost:8080/api/subscriptions/users/2',
        {
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const subscription = await response.json();
      setSubscriptionId(subscription.id);
      setState(STATES.READY);
    } catch (err) {
      console.log(err);
      setState(STATES.ERROR);
    }
  }, []);

  return (
    <Layout>
      <h1>Cancel Subscription</h1>
      <button
        className="btn-inverse"
        onClick={cancelSubscription}
        disabled={state === STATES.LOADING || state === STATES.INITIAL}
      >
        Cancel
      </button>
      {state === STATES.FINISHED && (
        <div>
          <h1>Subscription Canceled</h1>
        </div>
      )}
    </Layout>
  );
};

export default CancelPage;
