import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#000',
        color: '#fff',
        textAlign: 'center',
        padding: '20px'
      }}
    >
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>404</h1>
      <h2 style={{ marginBottom: '1rem' }}>Page Not Found</h2>
      <p style={{ marginBottom: '2rem' }}>
        The page you are looking for does not exist.
      </p>
      <Link 
        href="/"
        style={{
          backgroundColor: '#3B82F6',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
          textDecoration: 'none'
        }}
      >
        Go Home
      </Link>
    </div>
  );
} 