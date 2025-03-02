'use client';

import { useState, useEffect } from 'react';

interface LeafletComponents {
  MapContainer: any;
  TileLayer: any;
  Marker: any;
  Popup: any;
  leaflet: any;
  customIcon: any;
}

/**
 * Custom hook that dynamically imports Leaflet components only on the client side
 * to avoid SSR issues with window not defined errors
 */
export function useLeafletComponents(): { 
  isLoaded: boolean, 
  components: LeafletComponents | null 
} {
  const [isLoaded, setIsLoaded] = useState(false);
  const [components, setComponents] = useState<LeafletComponents | null>(null);

  useEffect(() => {
    // Only execute on client side
    if (typeof window === 'undefined') return;

    async function loadLeafletComponents() {
      try {
        // Import Leaflet components
        const [reactLeaflet, leaflet] = await Promise.all([
          import('react-leaflet'),
          import('leaflet')
        ]);

        // Fix default icon issues in Leaflet
        delete (leaflet.Icon.Default.prototype as any)._getIconUrl;
        leaflet.Icon.Default.mergeOptions({
          iconRetinaUrl: '/images/marker-icon-2x.png',
          iconUrl: '/images/marker-icon.png',
          shadowUrl: '/images/marker-shadow.png',
        });

        // Create custom icon
        const customIcon = new leaflet.Icon({
          iconUrl: '/images/marker-icon.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowUrl: '/images/marker-shadow.png',
          shadowSize: [41, 41],
        });

        // Set components
        setComponents({
          MapContainer: reactLeaflet.MapContainer,
          TileLayer: reactLeaflet.TileLayer,
          Marker: reactLeaflet.Marker,
          Popup: reactLeaflet.Popup,
          leaflet,
          customIcon
        });

        setIsLoaded(true);
      } catch (error) {
        console.error('Error loading Leaflet components:', error);
      }
    }

    loadLeafletComponents();
  }, []);

  return { isLoaded, components };
} 