import { useState } from 'react';
import { LockKeyhole } from 'lucide-react';

export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const configuredPassword = import.meta.env.VITE_ADMIN_PASSWORD;

  function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!configuredPassword) {
      setError('Admin password is not configured. Add VITE_ADMIN_PASSWORD and redeploy.');
      return;
    }

    if (password === configuredPassword) {
      sessionStorage.setItem('adminAuthenticated', 'true');
      onLogin();
      return;
    }

    setError('Incorrect password. Please try again.');
  }

  return (
    <main className="page page--admin-login">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-card__icon">
          <LockKeyhole size={30} aria-hidden="true" />
        </div>
        <p className="eyebrow">Admin Access</p>
        <h1>Rating Dashboard</h1>
        <p className="login-card__text">Enter the admin password to view technician service analytics.</p>

        <label htmlFor="admin-password">Password</label>
        <input
          id="admin-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter password"
          autoComplete="current-password"
        />

        {error ? <p className="form-error" role="alert">{error}</p> : null}

        <button type="submit" className="primary-button primary-button--full">
          Login
        </button>

        <p className="login-card__warning">
          This password gate is suitable for a demo. Use real authentication for sensitive production data.
        </p>
      </form>
    </main>
  );
}
