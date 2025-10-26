// components/LeafletRouteMap.jsx
import React, { useEffect, useRef, useState } from 'react';

// Import Leaflet directly (remove dynamic imports)
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const LeafletRouteMap = ({ fromCity, toCity }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [error, setError] = useState(null);

  // Simple one-time map initialization
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    console.log('🗺️ Initializing map...');

    try {
      // Create map instance
      mapInstance.current = L.map(mapRef.current, {
        zoomControl: true,
        dragging: true,
        scrollWheelZoom: true,
      }).setView([20.5937, 78.9629], 5);

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapInstance.current);

      console.log('✅ Map created');
      
      // Set map as ready after a short delay
      setTimeout(() => {
        setMapReady(true);
        console.log('✅ Map ready');
      }, 500);

    } catch (err) {
      console.error('❌ Map initialization failed:', err);
      setError('Failed to initialize map');
    }

    // Cleanup
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Handle route calculation
  useEffect(() => {
    if (!fromCity || !toCity || !mapReady || !mapInstance.current) {
      console.log('⏸️ Skipping route calc:', { fromCity, toCity, mapReady, hasMap: !!mapInstance.current });
      return;
    }

    console.log('🔄 Calculating route...');

    const fetchRoute = async () => {
      setLoading(true);
      setError(null);

      try {
        const map = mapInstance.current;

        // Clear previous layers
        map.eachLayer((layer) => {
          if (layer instanceof L.Polyline || layer instanceof L.Marker) {
            map.removeLayer(layer);
          }
        });

        // Geocode cities
        const geocodeCity = async (cityName) => {
          try {
            console.log('📍 Geocoding:', cityName);
            const response = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}&limit=1&countrycodes=in`
            );
            
            if (!response.ok) throw new Error('Geocoding failed');
            
            const data = await response.json();
            if (data.length > 0) {
              const coords = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
              console.log('✅ Geocoded:', cityName, coords);
              return coords;
            }
            return null;
          } catch (err) {
            console.error('❌ Geocoding error:', err);
            return null;
          }
        };

        // Get route from OSRM
        const getRouteFromOSRM = async (start, end) => {
          try {
            console.log('🛣️ Getting route from OSRM...');
            const response = await fetch(
              `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`
            );
            
            if (!response.ok) throw new Error('OSRM request failed');
            
            const data = await response.json();
            
            if (data.routes && data.routes.length > 0) {
              const routeData = data.routes[0];
              setDistance((routeData.distance / 1000).toFixed(1));
              setDuration(Math.ceil(routeData.duration / 60));
              
              const coordinates = routeData.geometry.coordinates.map(coord => [coord[1], coord[0]]);
              console.log('✅ Route found, coordinates:', coordinates.length);
              return coordinates;
            }
            console.warn('⚠️ No route found, using straight line');
            return [start, end];
          } catch (err) {
            console.error('❌ OSRM error:', err);
            return [start, end];
          }
        };

        const fromCoords = await geocodeCity(fromCity);
        const toCoords = await geocodeCity(toCity);

        if (fromCoords && toCoords) {
          console.log('📍 Coordinates:', { from: fromCoords, to: toCoords });
          
          const routeCoordinates = await getRouteFromOSRM(fromCoords, toCoords);
          
          // Create custom markers
          const createIcon = (color) => L.divIcon({
            html: `<div style="background:${color}; width:16px; height:16px; border-radius:50%; border:3px solid white; box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
            iconSize: [22, 22],
            iconAnchor: [11, 11]
          });

          // Add markers
          L.marker(fromCoords, { icon: createIcon('#22c55e') })
            .addTo(map)
            .bindPopup(`<div style="padding: 8px; text-align: center;"><strong>${fromCity}</strong><br>Departure</div>`);

          L.marker(toCoords, { icon: createIcon('#ef4444') })
            .addTo(map)
            .bindPopup(`<div style="padding: 8px; text-align: center;"><strong>${toCity}</strong><br>Destination</div>`);

          // Add route
          L.polyline(routeCoordinates, {
            color: '#dc2626',
            weight: 5,
            opacity: 0.8,
            lineJoin: 'round'
          }).addTo(map);
          
          // Fit map to show entire route
          const bounds = L.latLngBounds(routeCoordinates);
          map.fitBounds(bounds, { 
            padding: [20, 20],
            maxZoom: 10
          });

          console.log('✅ Route displayed on map');

          // Force refresh
          setTimeout(() => {
            map.invalidateSize(true);
          }, 100);

        } else {
          setError('Could not find coordinates for the selected cities');
        }

      } catch (err) {
        console.error('❌ Route calculation error:', err);
        setError('Failed to calculate route');
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [fromCity, toCity, mapReady]);

  // Debug: Check what's happening
  useEffect(() => {
    console.log('🔍 Current state:', { fromCity, toCity, mapReady, loading, error });
  }, [fromCity, toCity, mapReady, loading, error]);

  if (!fromCity || !toCity) {
    return (
      <div className="bg-gray-100 rounded-lg p-6 text-center">
        <p className="text-gray-500">Select source and destination to view route</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Route: {fromCity} → {toCity}
      </h3>

      {/* Error display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Status info */}
      <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between text-sm">
          <div className="text-blue-800">
            <span className="font-medium">Status:</span>{' '}
            {!mapReady && '🔄 Initializing map...'}
            {mapReady && loading && '🔄 Calculating route...'}
            {mapReady && !loading && '✅ Ready'}
          </div>
          <button 
            onClick={() => mapInstance.current?.invalidateSize(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition"
            disabled={!mapReady}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Route information */}
      {(distance || duration) && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex justify-between text-sm text-green-800">
            {distance && (
              <span className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Distance: <strong className="ml-1">{distance} km</strong>
              </span>
            )}
            {duration && (
              <span className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Duration: <strong className="ml-1">{duration} min</strong>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Map container */}
      <div className="relative">
        <div 
          ref={mapRef} 
          className="h-64 rounded-lg border-2 border-gray-300 bg-gray-50"
          style={{ minHeight: '256px' }}
        />
        
        {/* Loading overlay */}
        {(!mapReady || loading) && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600 text-sm">
                {!mapReady ? 'Initializing map...' : 'Calculating route...'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeafletRouteMap;