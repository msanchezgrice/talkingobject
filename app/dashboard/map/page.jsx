'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';

// This special approach uses a Client Component wrapper that only renders its children on the client
const ClientOnly = ({ children }) => {
  const [hasMounted, setHasMounted] = React.useState(false);
  
  React.useEffect(() => {
    setHasMounted(true);
  }, []);
  
  if (!hasMounted) {
    return (
      <div style={{
        background: '#111',
        borderRadius: '8px',
        padding: '40px',
        textAlign: 'center',
        height: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <p>Loading map interface...</p>
      </div>
    );
  }
  
  return children;
};

export default function MapPage() {
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
          marginBottom: '20px'
        }}>
          <h1 style={{ fontSize: '1.5rem' }}>Agent Locations Map</h1>
          <Link 
            href="/dashboard" 
            style={{
              background: '#3B82F6',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '5px',
              textDecoration: 'none'
            }}
          >
            Back to Dashboard
          </Link>
        </div>

        <ClientOnly>
          <div style={{
            background: '#111',
            borderRadius: '8px',
            padding: '40px',
            textAlign: 'center'
          }}>
            <h2 style={{ marginBottom: '20px' }}>Map Interface</h2>
            <p style={{ marginBottom: '30px' }}>
              The interactive map will be available after resolving Leaflet integration issues.
              Maps require client-side rendering to function properly.
            </p>
            <div style={{ marginTop: '20px' }}>
              <Link 
                href="/dashboard" 
                style={{
                  background: '#3B82F6',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '5px',
                  textDecoration: 'none',
                  display: 'inline-block'
                }}
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        </ClientOnly>
      </div>
    </div>
  );
} 