'use client';

import Link from 'next/link';

export default function CreateAgentPage() {
  return (
    <div style={{
      fontFamily: 'system-ui, sans-serif',
      background: 'black',
      color: 'white',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <div style={{
          marginBottom: '30px'
        }}>
          <Link 
            href="/dashboard" 
            style={{
              color: '#3B82F6',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center'
            }}
          >
            ← Back to Dashboard
          </Link>
          <h1 style={{ 
            fontSize: '2rem', 
            marginTop: '20px'
          }}>
            Create New Agent
          </h1>
        </div>

        <div style={{
          background: '#111',
          borderRadius: '8px',
          padding: '30px',
        }}>
          <div style={{ marginBottom: '20px' }}>
            <label 
              style={{ 
                display: 'block', 
                marginBottom: '8px',
                fontWeight: '500' 
              }}
            >
              Agent Name*
            </label>
            <input 
              type="text" 
              placeholder="E.g., Coffee Shop Guide" 
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #333',
                background: '#222',
                color: 'white'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label 
              style={{ 
                display: 'block', 
                marginBottom: '8px',
                fontWeight: '500' 
              }}
            >
              Personality*
            </label>
            <textarea 
              placeholder="Describe your agent's personality, tone, and backstory..." 
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #333',
                background: '#222',
                color: 'white',
                minHeight: '120px'
              }}
            />
          </div>

          <div style={{ marginTop: '30px', textAlign: 'right' }}>
            <Link 
              href="/dashboard" 
              style={{
                background: 'transparent',
                border: '1px solid #555',
                color: 'white',
                padding: '10px 16px',
                borderRadius: '5px',
                textDecoration: 'none',
                marginRight: '12px'
              }}
            >
              Cancel
            </Link>
            <button 
              style={{
                background: '#3B82F6',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '5px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Create Agent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 