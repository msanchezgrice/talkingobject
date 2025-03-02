export default function Home() {
  return (
    <div style={{
      fontFamily: 'system-ui, sans-serif',
      background: 'black',
      color: 'white',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <header style={{
        padding: '20px 0',
        borderBottom: '1px solid #333',
        marginBottom: '40px'
      }}>
        <h1 style={{ fontSize: '2rem', margin: 0 }}>Talking Objects</h1>
      </header>

      <main>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '20px' }}>
            Welcome to Talking Objects
          </h2>
          <p style={{ fontSize: '1.2rem', lineHeight: 1.5, marginBottom: '30px' }}>
            Create interactive, location-aware AI agents that can engage with the real world.
          </p>
          
          <div style={{ marginTop: '40px' }}>
            <a 
              href="/dashboard"
              style={{
                background: '#3B82F6',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '5px',
                textDecoration: 'none',
                display: 'inline-block',
                marginRight: '10px'
              }}
            >
              Dashboard
            </a>
            <a 
              href="/explore"
              style={{
                borderColor: '#6B7280',
                border: '1px solid',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '5px',
                textDecoration: 'none',
                display: 'inline-block'
              }}
            >
              Explore
            </a>
          </div>
        </div>
      </main>
    </div>
  );
} 