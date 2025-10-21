import React from "react";

const DeleteBusForm = ({ busNumber, loading, onBusNumberChange, onDelete }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Remove Bus</h2>
      <div className="space-y-4">
        <input
          className="input border-red-300 focus:ring-red-500 w-1/2"
          placeholder="Enter Bus Number"
          value={busNumber}
          onChange={onBusNumberChange}
        />
        <button
          onClick={onDelete}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Deleting..." : "Delete Bus"}
        </button>
      </div>
    </div>
  );
};

export default DeleteBusForm;