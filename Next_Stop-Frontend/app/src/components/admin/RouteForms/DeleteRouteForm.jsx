import React from "react";

const DeleteRouteForm = ({ routeId, loading, onRouteIdChange, onDelete }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Delete Route</h2>
      <div className="space-y-4">
        <input
          className="input border-red-300 focus:ring-red-500 w-1/2"
          placeholder="Enter Route ID"
          value={routeId}
          onChange={onRouteIdChange}
        />
        <button
          onClick={onDelete}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Deleting..." : "Delete Route"}
        </button>
      </div>
    </div>
  );
};

export default DeleteRouteForm;