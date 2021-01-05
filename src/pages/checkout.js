import { useState } from 'react';
import { useRouter } from 'next/router';
import { loadStripe } from '@stripe/stripe-js';
import {
  // CardElement,
  Elements,
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from '@stripe/react-stripe-js';
import styles from '../styles/Checkout.module.css';
import Layout from '../components/Layout/Layout';

const apiKey = process.env.NEXT_PUBLIC_STRIPE_KEY || '';
const stripePromise = loadStripe(apiKey);

const handleRequiresPaymentMethod = ({
  subscription,
  paymentMethodId,
  priceId,
}) => {
  if (subscription.status === 'active') {
    // subscription is active, no customer actions required.
    return { subscription, priceId, paymentMethodId };
  } else if (
    subscription.latest_invoice.payment_intent.status ===
    'requires_payment_method'
  ) {
    // Using localStorage to store the state of the retry here
    // (feel free to replace with what you prefer)
    // Store the latest invoice ID and status
    localStorage.setItem('latestInvoiceId', subscription.latest_invoice.id);
    localStorage.setItem(
      'latestInvoicePaymentIntentStatus',
      subscription.latest_invoice.payment_intent.status
    );
    throw new Error('Your card was declined.');
  } else {
    return { subscription, priceId, paymentMethodId };
  }
};

const Checkout = () => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [errorToDisplay, setErrorToDisplay] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const subscribe = async (paymentMethodId) => {
    const priceId = router.query.pId;
    const response = await fetch('http://localhost:8080/api/subscription', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        paymentMethodId: paymentMethodId,
        priceId: priceId,
      }),
    });
    const subscription = await response.json();
    if (
      subscription.latest_invoice.payment_intent.status ===
      'requires_payment_method'
    ) {
      // Using localStorage to store the state of the retry here
      // (feel free to replace with what you prefer)
      // Store the latest invoice ID and status
      localStorage.setItem('latestInvoiceId', subscription.latest_invoice.id);
      localStorage.setItem(
        'latestInvoicePaymentIntentStatus',
        subscription.latest_invoice.payment_intent.status
      );
      throw new Error('Your card was declined.');
    }
    console.log(res);
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      // Get a reference to a mounted CardElement. Elements knows how
      // to find your CardElement because there can only ever be one of
      // each type of element.
      const cardElement = elements.getElement(CardNumberElement);

      // If a previous payment was attempted, get the lastest invoice
      // const latestInvoicePaymentIntentStatus = localStorage.getItem(
      //   'latestInvoicePaymentIntentStatus'
      // );
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        console.log('[createPaymentMethod error]', error);
        setSubscribing(false);
        setErrorToDisplay(error && error.message);
        return;
      }

      console.log(paymentMethod);
      const paymentMethodId = paymentMethod.id;
      subscribe(paymentMethodId);
      setSubscribing(false);
    } catch (err) {
      console.log(err);
      // An error has happened. Display the failure to the user here.
      setSubscribing(false);
      setErrorToDisplay(error && error.error && error.error.decline_code);
    }
  };

  return (
    <Layout background>
      <form className="sr-main" onSubmit={handleSubmit}>
        <div className={styles['mb-1']}>
          <label className="font-bold text-white">Email</label>
          <input
            className={styles.input}
            value={email}
            placeholder="test@email.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles['mb-1']}>
          <label className="font-bold text-white">Card Number</label>
          <CardNumberElement className={styles.input} />
        </div>
        <div className={styles['mb-1']}>
          <label className="font-bold text-white">CCV</label>
          <CardCvcElement className={styles.input} />
        </div>
        <div className="mb-2">
          <label className="font-bold text-white">Expiration</label>
          <CardExpiryElement className={styles.input} />
        </div>
        <button
          className="btn-inverse"
          type="submit"
          disabled={!stripe && !subscribing}
        >
          <div>{subscribing ? 'Subscribing...' : 'Subscribe'}</div>
        </button>
      </form>
      <div className="text-gray-700 text-base mt-2" role="alert">
        {errorToDisplay ? errorToDisplay : null}
      </div>
    </Layout>
  );
};

const CheckoutPage = () => (
  <Elements stripe={stripePromise}>
    <Checkout></Checkout>
  </Elements>
);

export default CheckoutPage;
