'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useLeafletComponents } from '@/lib/useMapComponent';
import type { LeafletMouseEvent } from 'leaflet';

// Component props
interface LocationPickerProps {
  initialLatitude?: number;
  initialLongitude?: number;
  onLocationSelected: (lat: number, lng: number) => void;
  height?: string;
}

// Dynamic import of the location picker to avoid SSR issues
const LocationPicker = ({
  initialLatitude = 30.2672,
  initialLongitude = -97.7431,
  onLocationSelected,
  height = '400px'
}: LocationPickerProps) => {
  const [position, setPosition] = useState<[number, number]>([
    initialLatitude || 30.2672, 
    initialLongitude || -97.7431
  ]);
  const mapRef = useRef<any>(null);
  
  // Use our custom hook to get Leaflet components
  const { isLoaded, components } = useLeafletComponents();

  // Update position if props change
  useEffect(() => {
    if (initialLatitude && initialLongitude) {
      setPosition([initialLatitude, initialLongitude]);
    }
  }, [initialLatitude, initialLongitude]);

  // Set up map click handler when map is ready
  useEffect(() => {
    if (!isLoaded || !components || !mapRef.current) return;
    
    const handleMapClick = (e: LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onLocationSelected(lat, lng);
    };
    
    const map = mapRef.current;
    map.on('click', handleMapClick);
    
    return () => {
      map.off('click', handleMapClick);
    };
  }, [isLoaded, components, mapRef, onLocationSelected]);

  // Handle marker drag end events
  const handleMarkerDragEnd = (e: any) => {
    const marker = e.target;
    const position = marker.getLatLng();
    setPosition([position.lat, position.lng]);
    onLocationSelected(position.lat, position.lng);
  };

  // Show loading state while components are loading
  if (!isLoaded || !components) {
    return (
      <div 
        style={{ 
          height, 
          width: '100%', 
          backgroundColor: '#1f2937', 
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
    <div className="w-full rounded-md overflow-hidden" style={{ height: 'auto' }}>
      <div style={{ height }}>
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
          whenCreated={(map: any) => {
            mapRef.current = map;
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <Marker 
            position={position} 
            draggable={true} 
            icon={customIcon}
            eventHandlers={{
              dragend: handleMarkerDragEnd
            }}
          >
            <Popup>
              Selected Location<br/>
              Latitude: {position[0].toFixed(6)}<br/>
              Longitude: {position[1].toFixed(6)}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      
      <div className="mt-3 bg-gray-800 p-3 rounded text-sm text-gray-300">
        <p>Selected coordinates: <span className="font-mono text-white">{position[0].toFixed(6)}, {position[1].toFixed(6)}</span></p>
        <p className="mt-1">Click on the map or drag the marker to set the location.</p>
      </div>
    </div>
  );
};

// Export with dynamic import to prevent SSR issues
export default dynamic(() => Promise.resolve(LocationPicker), {
  ssr: false
}); 