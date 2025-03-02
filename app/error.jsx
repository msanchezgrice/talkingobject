'use client';

import { useEffect } from 'react';

// Simple client error component with no dependencies
export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      textAlign: 'center',
      color: 'white',
      background: 'black'
    }}>
      <h1 style={{ fontSize: '2rem', margin: '0 0 16px' }}>Something went wrong!</h1>
      <p style={{ margin: '0 0 24px' }}>
        We're sorry, but there was an error processing your request.
      </p>
      <div>
        <button
          onClick={reset}
          style={{
            background: '#3B82F6',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Try again
        </button>
        <a
          href="/"
          style={{
            background: '#6B7280',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '5px',
            textDecoration: 'none',
            display: 'inline-block'
          }}
        >
          Go to Home
        </a>
      </div>
    </div>
  );
} 