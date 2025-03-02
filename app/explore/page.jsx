'use client';

import Link from 'next/link';

export default function ExplorePage() {
  return (
    <div style={{
      fontFamily: 'system-ui, sans-serif',
      background: 'black',
      color: 'white',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'start',
          marginBottom: '40px'
        }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>Explore Agents</h1>
            <p style={{ color: '#aaa', marginTop: 0 }}>
              Discover interactive AI agents created by the Talking Objects community
            </p>
          </div>
          <Link 
            href="/explore/maps" 
            style={{
              background: '#374151',
              color: 'white',
              padding: '10px 16px',
              borderRadius: '5px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center'
            }}
          >
            View on Map
          </Link>
        </div>

        <div style={{
          background: '#111',
          borderRadius: '8px',
          padding: '40px',
          textAlign: 'center'
        }}>
          <p style={{ marginBottom: '20px', fontSize: '1.1rem' }}>
            The explore page is being developed. Soon you'll be able to discover agents created by the community.
          </p>
          <div style={{ marginTop: '30px' }}>
            <Link 
              href="/"
              style={{
                background: '#3B82F6',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '5px',
                textDecoration: 'none',
                display: 'inline-block',
                marginRight: '12px'
              }}
            >
              Return to Home
            </Link>
            <Link 
              href="/dashboard/create" 
              style={{
                border: '1px solid #555',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '5px',
                textDecoration: 'none',
                display: 'inline-block'
              }}
            >
              Create Your Own Agent
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 