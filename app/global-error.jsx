'use client';

// Simple global error handler
export default function GlobalError({ error }) {
  return (
    <html>
      <body style={{
        fontFamily: 'system-ui, sans-serif',
        background: 'black',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        margin: 0,
        padding: 20
      }}>
        <div style={{ maxWidth: 600, textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
            Something went wrong!
          </h1>
          <p style={{ marginBottom: '2rem' }}>
            The server encountered an error. Please try again later.
          </p>
          <a
            href="/"
            style={{
              background: '#3B82F6',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '5px',
              textDecoration: 'none'
            }}
          >
            Go to Home
          </a>
        </div>
      </body>
    </html>
  );
} 