'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
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
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        <header style={{
          borderBottom: '1px solid #333',
          paddingBottom: '20px',
          marginBottom: '30px'
        }}>
          <h1 style={{ fontSize: '2rem' }}>My Profile</h1>
        </header>

        {loading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid #333',
              borderTop: '3px solid #3B82F6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <style jsx>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : (
          <div style={{
            background: '#111',
            borderRadius: '8px',
            padding: '30px',
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: '30px'
            }}>
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: '#3B82F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '15px',
                fontSize: '2rem'
              }}>
                T
              </div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '5px' }}>Test User</h2>
              <p style={{ color: '#aaa', marginTop: 0 }}>test@example.com</p>
            </div>
            
            <div style={{
              background: '#222',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '30px'
            }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>Account Info</h3>
              <p style={{ color: '#aaa' }}>Member since: {new Date().toLocaleDateString()}</p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: '20px' }}>
                <p>Profile functionality is currently being developed.</p>
              </div>
              <Link 
                href="/dashboard"
                style={{
                  background: '#3B82F6',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  textDecoration: 'none',
                  display: 'inline-block'
                }}
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 