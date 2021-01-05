import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home() {
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
            <section>
              <img src="/img/starter.png" width="120" height="120" />
              <div className="name">Monthly Plan</div>
              <div className="price">$10</div>
              <div className="duration">per month</div>
              <Link href="/checkout?pId=price_1I0vlvLcRr0BCSZXQIwCj7Hf">
                <button>Select</button>
              </Link>
            </section>
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
