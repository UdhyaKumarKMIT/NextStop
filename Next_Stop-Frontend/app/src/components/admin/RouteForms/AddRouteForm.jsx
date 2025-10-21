import React from "react";

const AddRouteForm = ({ formData, loading, onChange, onSubmit }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Add Route</h2>
      <form onSubmit={onSubmit} className="grid grid-cols-2 gap-4">
        <input
          className="input border-red-300 focus:ring-red-500"
          placeholder="Route ID"
          value={formData.routeId}
          onChange={(e) => onChange({ ...formData, routeId: e.target.value })}
          required
        />
        <input
          className="input border-red-300 focus:ring-red-500"
          placeholder="Source"
          value={formData.source}
          onChange={(e) => onChange({ ...formData, source: e.target.value })}
          required
        />
        <input
          className="input border-red-300 focus:ring-red-500"
          placeholder="Destination"
          value={formData.destination}
          onChange={(e) => onChange({ ...formData, destination: e.target.value })}
          required
        />
        <input
          className="input border-red-300 focus:ring-red-500"
          placeholder="Distance (km)"
          type="number"
          value={formData.distance}
          onChange={(e) => onChange({ ...formData, distance: e.target.value })}
          required
        />
        <input
          className="input border-red-300 focus:ring-red-500"
          placeholder="Duration (e.g. 4h 30m)"
          value={formData.duration}
          onChange={(e) => onChange({ ...formData, duration: e.target.value })}
          required
        />
        <input
          className="input border-red-300 focus:ring-red-500"
          placeholder="Fare (₹)"
          type="number"
          value={formData.fare}
          onChange={(e) => onChange({ ...formData, fare: e.target.value })}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="col-span-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Route"}
        </button>
      </form>
    </div>
  );
};

export default AddRouteForm;