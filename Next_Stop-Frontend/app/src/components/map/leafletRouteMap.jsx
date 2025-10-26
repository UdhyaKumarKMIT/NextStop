// components/LeafletRouteMap.jsx
import React, { useEffect, useRef } from 'react';

const LeafletRouteMap = ({ fromCity, toCity }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);

  // Tamil Nadu city coordinates with route waypoints
  const cityCoordinates = {
    "chennai": [13.0827, 80.2707],
    "coimbatore": [11.0168, 76.9558],
    "madurai": [9.9252, 78.1198],
    "trichy": [10.7905, 78.7047],
    "kanyakumari": [8.0883, 77.5385],
    "salem": [11.6643, 78.1460],
    "tirunelveli": [8.7139, 77.7567],
    "vellore": [12.9165, 79.1325]
  };

  // Function to generate curved route points
  const generateCurvedRoute = (start, end) => {
    const points = [start];
    
    // Calculate intermediate points for curvature
    const distance = Math.sqrt(
      Math.pow(end[0] - start[0], 2) + Math.pow(end[1] - start[1], 2)
    );
    
    // Add curvature based on distance and direction
    const curvature = 0.3; // Adjust this value for more/less curvature
    
    // Midpoint with curvature
    const midLat = (start[0] + end[0]) / 2;
    const midLng = (start[1] + end[1]) / 2;
    
    // Calculate perpendicular direction for curvature
    const dx = end[1] - start[1];
    const dy = end[0] - start[0];
    
    // Control point for Bezier curve
    const controlLat = midLat + (-dy) * curvature;
    const controlLng = midLng + (dx) * curvature;
    
    // Generate points along the curve
    for (let t = 0.1; t < 1; t += 0.2) {
      const lat = 
        Math.pow(1 - t, 2) * start[0] + 
        2 * (1 - t) * t * controlLat + 
        Math.pow(t, 2) * end[0];
      
      const lng = 
        Math.pow(1 - t, 2) * start[1] + 
        2 * (1 - t) * t * controlLng + 
        Math.pow(t, 2) * end[1];
      
      points.push([lat, lng]);
    }
    
    points.push(end);
    return points;
  };

  // Function to generate realistic route based on actual Tamil Nadu highways
  const generateRealisticRoute = (fromCity, toCity) => {
    const fromCoord = cityCoordinates[fromCity.toLowerCase()];
    const toCoord = cityCoordinates[toCity.toLowerCase()];
    
    if (!fromCoord || !toCoord) return [fromCoord, toCoord];

    // Define major highway waypoints in Tamil Nadu
    const highwayPoints = {
      "chennai-madurai": [
        [13.0827, 80.2707], // Chennai
        [12.8392, 79.7008], // Sriperumbudur
        [12.5200, 79.9000], // Kanchipuram area
        [11.6643, 78.1460], // Salem
        [10.7905, 78.7047], // Trichy
        [10.0000, 78.0000], // Dindigul area
        [9.9252, 78.1198]   // Madurai
      ],
      "chennai-trichy": [
        [13.0827, 80.2707], // Chennai
        [12.8392, 79.7008], // Sriperumbudur
        [12.5200, 79.9000], // Kanchipuram
        [11.6643, 78.1460], // Salem
        [11.1000, 78.4000], // Namakkal area
        [10.7905, 78.7047]  // Trichy
      ],
      "chennai-coimbatore": [
        [13.0827, 80.2707], // Chennai
        [12.8392, 79.7008], // Sriperumbudur
        [12.5200, 79.9000], // Kanchipuram
        [11.6643, 78.1460], // Salem
        [11.0000, 77.0000], // Erode area
        [11.0168, 76.9558]  // Coimbatore
      ],
      "madurai-trichy": [
        [9.9252, 78.1198],  // Madurai
        [10.3000, 78.2000], // Melur area
        [10.5000, 78.5000], // Pudukkottai area
        [10.7905, 78.7047]  // Trichy
      ],
      "coimbatore-madurai": [
        [11.0168, 76.9558], // Coimbatore
        [10.9000, 77.4000], // Dharapuram area
        [10.5000, 77.8000], // Dindigul area
        [10.0000, 77.9000], // Theni area
        [9.9252, 78.1198]   // Madurai
      ]
    };

    const routeKey = `${fromCity.toLowerCase()}-${toCity.toLowerCase()}`;
    const reverseKey = `${toCity.toLowerCase()}-${fromCity.toLowerCase()}`;
    
    if (highwayPoints[routeKey]) {
      return highwayPoints[routeKey];
    } else if (highwayPoints[reverseKey]) {
      return [...highwayPoints[reverseKey]].reverse();
    } else {
      // Fallback to curved route
      return generateCurvedRoute(fromCoord, toCoord);
    }
  };

  useEffect(() => {
    // Check if cities are provided
    if (!fromCity || !toCity) {
      console.log("⏳ Waiting for city data...");
      return;
    }

    console.log("🗺️ Initializing map for:", fromCity, "→", toCity);

    const initMap = async () => {
      try {
        // Dynamically import Leaflet
        const L = await import('leaflet');
        
        // Import Leaflet CSS
        await import('leaflet/dist/leaflet.css');

        // Fix for default markers
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        if (!mapRef.current) {
          console.log("❌ Map container not found");
          return;
        }

        // Clean up previous map instance
        if (mapInstance.current) {
          mapInstance.current.remove();
          markersRef.current = [];
        }

        // Get coordinates and generate route
        const fromCoord = cityCoordinates[fromCity.toLowerCase()];
        const toCoord = cityCoordinates[toCity.toLowerCase()];

        if (!fromCoord || !toCoord) {
          console.log("❌ Coordinates not found for cities");
          return;
        }

        console.log("📍 Coordinates:", { fromCoord, toCoord });

        // Generate realistic route
        const routePoints = generateRealisticRoute(fromCity, toCity);
        console.log("🛣️ Route points:", routePoints);

        // Calculate center point
        const center = [
          (fromCoord[0] + toCoord[0]) / 2,
          (fromCoord[1] + toCoord[1]) / 2
        ];

        // Initialize map
        const map = L.map(mapRef.current).setView(center, 8);
        mapInstance.current = map;

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Create custom icons
        const startIcon = L.divIcon({
          html: `
            <div style="
              background-color: #10B981; 
              width: 24px; 
              height: 24px; 
              border-radius: 50%; 
              border: 3px solid white; 
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              color: white;
              font-size: 12px;
            ">A</div>
          `,
          className: 'custom-div-icon',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const endIcon = L.divIcon({
          html: `
            <div style="
              background-color: #EF4444; 
              width: 24px; 
              height: 24px; 
              border-radius: 50%; 
              border: 3px solid white; 
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              color: white;
              font-size: 12px;
            ">B</div>
          `,
          className: 'custom-div-icon',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        // Add start marker
        const startMarker = L.marker(fromCoord, { icon: startIcon })
          .addTo(map)
          .bindPopup(`
            <div style="text-align: center; min-width: 120px;">
              <strong style="color: #10B981;">🚗 Departure</strong><br/>
              <strong>${fromCity}</strong>
            </div>
          `)
          .openPopup();
        markersRef.current.push(startMarker);

        // Add end marker
        const endMarker = L.marker(toCoord, { icon: endIcon })
          .addTo(map)
          .bindPopup(`
            <div style="text-align: center; min-width: 120px;">
              <strong style="color: #EF4444;">🏁 Destination</strong><br/>
              <strong>${toCity}</strong>
            </div>
          `);
        markersRef.current.push(endMarker);

        // Draw curved route line
        const routeLine = L.polyline(routePoints, {
          color: '#3B82F6',
          weight: 5,
          opacity: 0.8,
          lineJoin: 'round'
        }).addTo(map);
        markersRef.current.push(routeLine);

        // Add intermediate waypoint markers for longer routes
        if (routePoints.length > 3) {
          for (let i = 1; i < routePoints.length - 1; i++) {
            const waypointIcon = L.divIcon({
              html: `
                <div style="
                  background-color: #F59E0B; 
                  width: 8px; 
                  height: 8px; 
                  border-radius: 50%; 
                  border: 2px solid white;
                  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
                "></div>
              `,
              className: 'waypoint-icon',
              iconSize: [8, 8],
              iconAnchor: [4, 4],
            });
            
            const waypointMarker = L.marker(routePoints[i], { icon: waypointIcon })
              .addTo(map);
            markersRef.current.push(waypointMarker);
          }
        }

        // Fit map to show the entire route
        const bounds = L.latLngBounds(routePoints);
        map.fitBounds(bounds, { padding: [30, 30] });

        console.log("✅ Map initialized successfully with curved route");

      } catch (error) {
        console.error('❌ Error loading Leaflet:', error);
      }
    };

    initMap();

    // Cleanup function
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
      markersRef.current = [];
    };
  }, [fromCity, toCity]);

  if (!fromCity || !toCity) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
        <div className="text-center text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <h3 className="text-lg font-semibold mb-2">Route Map</h3>
          <p>Select departure and destination cities</p>
          <p className="text-sm mt-1">to view the interactive map</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
        <h3 className="font-bold text-lg">
          Route Map: {fromCity} → {toCity}
        </h3>
        <div className="flex gap-4 mt-2 text-blue-100 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Departure (A)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Destination (B)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-1 bg-yellow-500 rounded-full"></div>
            <span>Waypoints</span>
          </div>
        </div>
      </div>
      
      {/* Map Container */}
      <div 
        ref={mapRef} 
        className="w-full h-96 bg-gray-100"
        style={{ minHeight: '384px' }}
      />
      
      {/* Footer */}
      <div className="bg-white p-3 border-t text-sm text-gray-600">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Powered by OpenStreetMap</span>
        </div>
      </div>
    </div>
  );
};

export default LeafletRouteMap;