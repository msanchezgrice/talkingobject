import { ImageResponse } from 'next/og';
import { getAgentBySlug } from '@/lib/placeholder-agents';

// Route segment config
export const runtime = 'edge';
export const alt = 'Chat with an object';
export const size = {
  width: 1200,
  height: 630,
};

type PageParams = {
  params: {
    slug: string;
  };
};

// Image generation
export default async function Image({ params }: PageParams) {
  const slug = params.slug;
  const agent = getAgentBySlug(slug);
  
  if (!agent) {
    // Default image if agent not found
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 64,
            background: '#0F172A',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            padding: 32,
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 24, color: '#2563EB' }}>Talking Objects</div>
          <div>Agent Not Found</div>
        </div>
      )
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: '#0F172A',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: 32,
        }}
      >
        <div style={{ 
          fontSize: 64, 
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: 24,
        }}>
          {agent.name}
        </div>
        
        <div style={{ 
          fontSize: 32, 
          color: '#94A3B8',
          textAlign: 'center',
          marginBottom: 48,
        }}>
          Chat with {agent.name} now!
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 24,
        }}>
          <div style={{ 
            color: '#2563EB',
            fontSize: 24,
            background: 'rgba(37, 99, 235, 0.1)',
            padding: '12px 24px',
            borderRadius: 8,
          }}>
            talkingobjects.ai
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
} 