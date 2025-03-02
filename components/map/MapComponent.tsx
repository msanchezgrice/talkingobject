'use client';

import React from 'react';
import { PlaceholderAgent } from '@/lib/placeholder-agents';
import Link from 'next/link';
import { useLeafletComponents } from '@/lib/useMapComponent';

// Need to import Leaflet CSS
import 'leaflet/dist/leaflet.css';

// Define the props interface outside the component
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
  // Use our custom hook to get Leaflet components
  const { isLoaded, components } = useLeafletComponents();

  // Show loading state while components are loading
  if (!isLoaded || !components) {
    return (
      <div 
        style={{ 
          height, 
          width: '100%', 
          backgroundColor: '#f0f0f0', 
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        Loading map...
      </div>
    );
  }

  // Destructure the dynamically imported components
  const { MapContainer, TileLayer, Marker, Popup } = components;
  const customIcon = components.customIcon;

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