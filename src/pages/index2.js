import { useState } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout/Layout';

export default function Home() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/create-customer', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
      }),
    });
    const res = await response.json();
    console.log(res);
  };

  return (
    <Layout>
      <div>
        <form onSubmit={handleSubmit}>
          <h1>Register</h1>
          <div className="mb-2">
            <label className="font-bold text-white">Email</label>
            <input
              className="input"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
            ></input>
          </div>
          <button className="btn-inverse">Sign Up</button>
        </form>
      </div>
    </Layout>
  );
}
