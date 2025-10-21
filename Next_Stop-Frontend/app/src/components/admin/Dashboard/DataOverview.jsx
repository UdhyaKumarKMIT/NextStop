import React from "react";

const DataOverview = ({ buses, routes }) => {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-red-600">Buses Overview</h3>
        <p className="text-sm text-gray-600 mb-3">Total: {buses.length} buses</p>
        <div className="max-h-60 overflow-y-auto">
          {buses.length > 0 ? (
            buses.map(bus => (
              <div key={bus._id} className="border-b border-gray-200 py-2 last:border-b-0">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{bus.busNumber}</span>
                  <span className="text-sm text-gray-600">{bus.type}</span>
                </div>
                <p className="text-sm text-gray-600">{bus.busName}</p>
                <p className="text-xs text-gray-500">Route: {bus.routeId}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No buses found</p>
          )}
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-green-600">Routes Overview</h3>
        <p className="text-sm text-gray-600 mb-3">Total: {routes.length} routes</p>
        <div className="max-h-60 overflow-y-auto">
          {routes.length > 0 ? (
            routes.map(route => (
              <div key={route._id} className="border-b border-gray-200 py-2 last:border-b-0">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{route.routeId}</span>
                  <span className="text-sm text-green-600">₹{route.fare}</span>
                </div>
                <p className="text-sm text-gray-600">{route.source} → {route.destination}</p>
                <p className="text-xs text-gray-500">{route.distance} km • {route.duration}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No routes found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataOverview;