import { NextResponse } from 'next/server';

interface TicketmasterEvent {
  name: string;
  dates: {
    start: {
      localDate: string;
      localTime: string;
    };
  };
  url: string;
  images: Array<{
    url: string;
    width: number;
    height: number;
  }>;
  _embedded?: {
    venues?: Array<{
      name: string;
      city?: {
        name: string;
      };
    }>;
  };
  priceRanges?: Array<{
    min: number;
    max: number;
    currency: string;
  }>;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const lat = url.searchParams.get('lat');
    const lon = url.searchParams.get('lon');
    
    if (!lat || !lon) {
      return NextResponse.json(
        { error: 'Missing latitude or longitude parameters' },
        { status: 400 }
      );
    }
    
    const apiKey = process.env.TICKETMASTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Ticketmaster API key not configured' },
        { status: 500 }
      );
    }
    
    // Get events near the specified location
    const radius = 25; // 25 miles/km radius
    const eventsResponse = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&latlong=${lat},${lon}&radius=${radius}&size=10&sort=date,asc`
    );
    
    if (!eventsResponse.ok) {
      throw new Error(`Ticketmaster API returned status: ${eventsResponse.status}`);
    }
    
    const eventsData = await eventsResponse.json();
    
    // Check if events were found
    if (!eventsData._embedded || !eventsData._embedded.events) {
      return NextResponse.json({ events: [] });
    }
    
    // Format the events data
    const formattedData = {
      totalEvents: eventsData.page.totalElements,
      events: eventsData._embedded.events.map((event: TicketmasterEvent) => ({
        name: event.name,
        date: event.dates.start.localDate,
        time: event.dates.start.localTime,
        url: event.url,
        venue: event._embedded?.venues?.[0]?.name || 'Unknown Venue',
        location: event._embedded?.venues?.[0]?.city?.name || 'Unknown Location',
        image: event.images.find(img => img.width > 500)?.url || event.images[0]?.url,
        priceRange: event.priceRanges 
          ? `${event.priceRanges[0].min}-${event.priceRanges[0].max} ${event.priceRanges[0].currency}`
          : 'Price information not available'
      }))
    };
    
    return NextResponse.json(formattedData);
    
  } catch (error) {
    console.error('Error fetching events data:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// Mark as dynamic for static export
export const dynamic = 'force-dynamic'; 