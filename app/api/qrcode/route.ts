import { NextResponse } from 'next/server';
import QRCode from 'qrcode';

interface QROptions {
  margin?: number;
  scale?: number;
  color?: {
    dark?: string;
    light?: string;
  };
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const data = url.searchParams.get('data');
    const format = url.searchParams.get('format') || 'svg';
    
    // Get custom options if provided
    const margin = url.searchParams.get('margin') ? parseInt(url.searchParams.get('margin') as string) : 4;
    const scale = url.searchParams.get('scale') ? parseInt(url.searchParams.get('scale') as string) : 4;
    const dark = url.searchParams.get('dark') || '#000000';
    const light = url.searchParams.get('light') || '#ffffff';
    
    if (!data) {
      return NextResponse.json(
        { error: 'Missing data parameter' },
        { status: 400 }
      );
    }
    
    // Configure QR code options
    const options: QROptions = {
      margin,
      scale,
      color: {
        dark,
        light
      }
    };
    
    let qrResult;
    
    if (format === 'svg') {
      qrResult = await QRCode.toString(data, {
        ...options,
        type: 'svg'
      });
      
      return new NextResponse(qrResult, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=31536000, immutable'
        }
      });
    } else {
      // Default to PNG
      qrResult = await QRCode.toBuffer(data, {
        ...options,
        type: 'png'
      });
      
      return new NextResponse(qrResult, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=31536000, immutable'
        }
      });
    }
    
  } catch (error) {
    console.error('Error generating QR code:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 