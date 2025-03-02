'use client';

import Link from 'next/link';

export default function DashboardPage() {
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
          alignItems: 'center',
          marginBottom: '40px'
        }}>
          <h1 style={{ fontSize: '2rem' }}>Your Agents</h1>
          <div>
            <Link 
              href="/dashboard/map" 
              style={{
                background: '#374151',
                color: 'white',
                padding: '10px 16px',
                borderRadius: '5px',
                textDecoration: 'none',
                marginRight: '10px',
                display: 'inline-block'
              }}
            >
              View Map
            </Link>
            <Link 
              href="/dashboard/create" 
              style={{
                background: '#3B82F6',
                color: 'white',
                padding: '10px 16px',
                borderRadius: '5px',
                textDecoration: 'none',
                display: 'inline-block'
              }}
            >
              Create New Agent
            </Link>
          </div>
        </div>

        <div style={{
          background: '#111',
          borderRadius: '8px',
          padding: '40px',
          textAlign: 'center'
        }}>
          <p style={{ marginBottom: '20px' }}>
            Your agent dashboard is being set up. You'll be able to manage your AI agents here.
          </p>
          <div style={{ marginTop: '20px' }}>
            <Link 
              href="/"
              style={{
                background: '#3B82F6',
                color: 'white',
                padding: '10px 16px',
                borderRadius: '5px',
                textDecoration: 'none',
                display: 'inline-block'
              }}
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 