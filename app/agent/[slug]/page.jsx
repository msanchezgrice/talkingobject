'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function AgentPage() {
  const params = useParams();
  const slug = params.slug || 'unknown-agent';
  
  // Format the slug for display by replacing dashes with spaces and capitalizing
  const formattedName = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

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
          marginBottom: '30px'
        }}>
          <Link 
            href="/explore" 
            style={{
              color: '#3B82F6',
              textDecoration: 'none'
            }}
          >
            ← Back to Explore
          </Link>
        </div>
        
        <div style={{
          background: '#111',
          borderRadius: '8px',
          padding: '30px',
          marginBottom: '30px'
        }}>
          <h1 style={{ 
            fontSize: '2rem', 
            marginBottom: '15px' 
          }}>
            {formattedName}
          </h1>
          <p style={{ 
            color: '#aaa',
            marginBottom: '20px' 
          }}>
            This agent page is under development. Soon you'll be able to interact with {formattedName} and learn more about this location.
          </p>
          
          <div style={{
            background: '#222',
            borderRadius: '8px',
            padding: '30px',
            marginTop: '30px',
            marginBottom: '30px',
            textAlign: 'center'
          }}>
            <p style={{ marginBottom: '20px' }}>
              Chat functionality coming soon!
            </p>
            <textarea
              placeholder="Type your message..."
              style={{
                width: '100%',
                maxWidth: '500px',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #444',
                background: '#333',
                color: 'white',
                minHeight: '80px',
                marginBottom: '15px'
              }}
              disabled
            />
            <div>
              <button
                style={{
                  background: '#3B82F6',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  border: 'none',
                  cursor: 'not-allowed',
                  opacity: '0.7'
                }}
                disabled
              >
                Send Message
              </button>
            </div>
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <Link 
              href="/"
              style={{
                background: '#3B82F6',
                color: 'white',
                padding: '10px 20px',
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