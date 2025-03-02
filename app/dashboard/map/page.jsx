'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function MapPage() {
  const [isClient, setIsClient] = useState(false);

  // Only render map components on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

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

        {!isClient ? (
          <div style={{
            background: '#111',
            borderRadius: '8px',
            padding: '40px',
            textAlign: 'center'
          }}>
            <p>Loading map interface...</p>
          </div>
        ) : (
          <div style={{
            background: '#111',
            borderRadius: '8px',
            padding: '40px',
            textAlign: 'center'
          }}>
            <h2 style={{ marginBottom: '20px' }}>Map Interface</h2>
            <p>
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
        )}
      </div>
    </div>
  );
} 