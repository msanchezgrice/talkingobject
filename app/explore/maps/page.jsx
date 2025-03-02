'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ExploreMapPage() {
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
          marginBottom: '30px'
        }}>
          <h1 style={{ fontSize: '1.8rem' }}>Explore Agents Map</h1>
          <Link 
            href="/explore" 
            style={{
              background: '#374151',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '5px',
              textDecoration: 'none'
            }}
          >
            Back to Explore
          </Link>
        </div>

        {!isClient ? (
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
        ) : (
          <div style={{
            background: '#111',
            borderRadius: '8px',
            padding: '40px',
            textAlign: 'center'
          }}>
            <h2 style={{ marginBottom: '20px' }}>Austin Landmarks Map</h2>
            <p style={{ marginBottom: '30px' }}>
              This interactive map will display agent locations around Austin.
              The map functionality is currently being developed.
            </p>
            <div style={{ marginTop: '30px' }}>
              <Link 
                href="/explore" 
                style={{
                  background: '#3B82F6',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  textDecoration: 'none',
                  display: 'inline-block'
                }}
              >
                Back to Explore
              </Link>
            </div>
          </div>
        )}
        
        <div style={{
          background: '#111',
          borderRadius: '8px',
          padding: '30px',
          marginTop: '30px'
        }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '15px' }}>About Austin Landmarks</h3>
          <p style={{ color: '#ccc', lineHeight: '1.6' }}>
            Explore Austin's iconic landmarks and attractions through interactive AI agents.
            Each agent represents a unique location and has its own personality and stories to tell.
          </p>
        </div>
      </div>
    </div>
  );
} 