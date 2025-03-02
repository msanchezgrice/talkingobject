// Extremely simplified 404 page with no dependencies
export default function NotFound() {
  return (
    <div style={{
      fontFamily: 'system-ui, sans-serif',
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
      <h1 style={{ fontSize: '4rem', margin: '0 0 16px' }}>404</h1>
      <h2 style={{ margin: '0 0 16px' }}>Page Not Found</h2>
      <p style={{ margin: '0 0 24px' }}>
        The page you are looking for does not exist.
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
        Go Home
      </a>
    </div>
  );
} 