'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import Link from 'next/link';
import { PlaceholderAgent } from '@/lib/placeholder-agents';

// Need to import Leaflet CSS
import 'leaflet/dist/leaflet.css';

interface MapComponentProps {
  agents: PlaceholderAgent[];
  height?: string;
  zoom?: number;
  center?: [number, number]; // [latitude, longitude]
  linkBase?: string; // Base URL for agent links (e.g., "/dashboard" or "/explore")
}

const MapComponent: React.FC<MapComponentProps> = ({
  agents,
  height = '600px',
  zoom = 13,
  center = [30.2672, -97.7431], // Default to Austin, TX coordinates
  linkBase = '/agent',
}) => {
  const [isClient, setIsClient] = useState(false);

  // Prevent SSR issues with Leaflet
  useEffect(() => {
    setIsClient(true);
    
    // Fix for default marker icons in React-Leaflet
    // This is a workaround for the missing marker issue in react-leaflet
    delete (Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
    Icon.Default.mergeOptions({
      iconRetinaUrl: '/images/marker-icon-2x.png',
      iconUrl: '/images/marker-icon.png',
      shadowUrl: '/images/marker-shadow.png',
    });
  }, []);

  // Customize the marker icon
  const customIcon = new Icon({
    iconUrl: '/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: '/images/marker-shadow.png',
    shadowSize: [41, 41],
  });

  if (!isClient) {
    return <div style={{ height, width: '100%', backgroundColor: '#f0f0f0' }}>Loading map...</div>;
  }

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height, width: '100%', borderRadius: '8px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {agents.filter(agent => agent.latitude && agent.longitude).map((agent) => (
        <Marker
          key={agent.id}
          position={[agent.latitude!, agent.longitude!]}
          icon={customIcon}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold">{agent.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{agent.description?.substring(0, 100) || agent.personality.substring(0, 100)}...</p>
              <Link
                href={`${linkBase}/${agent.slug}`}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View Details
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent; 