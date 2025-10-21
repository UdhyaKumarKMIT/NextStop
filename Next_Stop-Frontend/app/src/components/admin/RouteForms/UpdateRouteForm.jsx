import React from "react";

const UpdateRouteForm = ({
  routeId,
  onRouteIdChange,
  formData,
  loading,
  onFormChange,
  onSubmit
}) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Update Route</h2>
      <div className="space-y-4">
        <input
          className="input border-red-300 focus:ring-red-500 w-1/2"
          placeholder="Route ID to Update"
          value={routeId}
          onChange={onRouteIdChange}
        />
        <form onSubmit={onSubmit} className="grid grid-cols-2 gap-4">
          <input
            className="input border-red-300 focus:ring-red-500"
            placeholder="Source"
            value={formData.source}
            onChange={(e) => onFormChange({ ...formData, source: e.target.value })}
          />
          <input
            className="input border-red-300 focus:ring-red-500"
            placeholder="Destination"
            value={formData.destination}
            onChange={(e) => onFormChange({ ...formData, destination: e.target.value })}
          />
          <input
            className="input border-red-300 focus:ring-red-500"
            placeholder="Distance (km)"
            type="number"
            value={formData.distance}
            onChange={(e) => onFormChange({ ...formData, distance: e.target.value })}
          />
          <input
            className="input border-red-300 focus:ring-red-500"
            placeholder="Duration"
            value={formData.duration}
            onChange={(e) => onFormChange({ ...formData, duration: e.target.value })}
          />
          <input
            className="input border-red-300 focus:ring-red-500"
            placeholder="Fare (₹)"
            type="number"
            value={formData.fare}
            onChange={(e) => onFormChange({ ...formData, fare: e.target.value })}
          />
          <button
            type="submit"
            disabled={loading}
            className="col-span-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Route"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateRouteForm;