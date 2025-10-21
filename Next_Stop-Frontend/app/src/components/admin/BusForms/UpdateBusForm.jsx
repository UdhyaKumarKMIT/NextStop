import React from "react";

const UpdateBusForm = ({ 
  busNumber, 
  onBusNumberChange, 
  formData, 
  loading, 
  onFormChange, 
  onSubmit 
}) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Update Bus Details</h2>
      <div className="space-y-4">
        <input
          className="input border-red-300 focus:ring-red-500 w-1/2"
          placeholder="Bus Number to Update"
          value={busNumber}
          onChange={onBusNumberChange}
        />
        <form onSubmit={onSubmit} className="grid grid-cols-2 gap-4">
          <input
            className="input border-red-300 focus:ring-red-500"
            placeholder="Bus Name"
            value={formData.busName}
            onChange={(e) => onFormChange({ ...formData, busName: e.target.value })}
          />
          <select
            className="input border-red-300 focus:ring-red-500"
            value={formData.type}
            onChange={(e) => onFormChange({ ...formData, type: e.target.value })}
          >
            <option>AC</option>
            <option>Non-AC</option>
            <option>Sleeper</option>
          </select>
          <input
            className="input border-red-300 focus:ring-red-500"
            placeholder="Route ID"
            value={formData.routeId}
            onChange={(e) => onFormChange({ ...formData, routeId: e.target.value })}
          />
          <input
            className="input border-red-300 focus:ring-red-500"
            placeholder="Total Seats"
            type="number"
            value={formData.totalSeats}
            onChange={(e) => onFormChange({ ...formData, totalSeats: e.target.value })}
          />
          <input
            className="input border-red-300 focus:ring-red-500"
            placeholder="Operator Name 1"
            value={formData.operator1.name}
            onChange={(e) => onFormChange({
              ...formData,
              operator1: { ...formData.operator1, name: e.target.value }
            })}
          />
          <input
            className="input border-red-300 focus:ring-red-500"
            placeholder="Operator Phone 1"
            value={formData.operator1.phone}
            onChange={(e) => onFormChange({
              ...formData,
              operator1: { ...formData.operator1, phone: e.target.value }
            })}
          />
          <button
            type="submit"
            disabled={loading}
            className="col-span-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Bus"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateBusForm;