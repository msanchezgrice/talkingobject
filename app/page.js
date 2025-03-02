export default function Home() {
  return (
    <div style={{
      fontFamily: 'system-ui, sans-serif',
      background: 'black',
      color: 'white',
      minHeight: '100vh',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
        Talking Objects
      </h1>
      <p style={{ fontSize: '1.2rem', maxWidth: '600px', marginBottom: '2rem' }}>
        Create interactive, location-aware AI agents that can engage with the real world.
      </p>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <a 
          href="/dashboard" 
          style={{
            backgroundColor: '#3B82F6',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.375rem',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}
        >
          Dashboard
        </a>
        <a 
          href="/explore" 
          style={{
            border: '1px solid #6B7280',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.375rem',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}
        >
          Explore
        </a>
      </div>
    </div>
  );
}