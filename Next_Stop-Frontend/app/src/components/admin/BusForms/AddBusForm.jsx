import React from "react";

const AddBusForm = ({ formData, loading, onChange, onSubmit }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Add New Bus</h2>
      <form onSubmit={onSubmit} className="grid grid-cols-2 gap-4">
        <input
          className="input border-red-300 focus:ring-red-500"
          placeholder="Bus Number"
          value={formData.busNumber}
          onChange={(e) => onChange({ ...formData, busNumber: e.target.value })}
          required
        />
        <input
          className="input border-red-300 focus:ring-red-500"
          placeholder="Bus Name"
          value={formData.busName}
          onChange={(e) => onChange({ ...formData, busName: e.target.value })}
          required
        />
        <select
          className="input border-red-300 focus:ring-red-500"
          value={formData.type}
          onChange={(e) => onChange({ ...formData, type: e.target.value })}
        >
          <option>AC</option>
          <option>Non-AC</option>
          <option>Sleeper</option>
        </select>
        <input
          className="input border-red-300 focus:ring-red-500"
          placeholder="Route ID"
          value={formData.routeId}
          onChange={(e) => onChange({ ...formData, routeId: e.target.value })}
          required
        />
        <input
          className="input border-red-300 focus:ring-red-500"
          placeholder="Total Seats"
          type="number"
          value={formData.totalSeats}
          onChange={(e) => onChange({ ...formData, totalSeats: e.target.value })}
          required
        />
        <input
          className="input border-red-300 focus:ring-red-500"
          placeholder="Operator Name 1"
          value={formData.operator1.name}
          onChange={(e) => onChange({
            ...formData,
            operator1: { ...formData.operator1, name: e.target.value }
          })}
          required
        />
        <input
          className="input border-red-300 focus:ring-red-500"
          placeholder="Operator Phone 1"
          value={formData.operator1.phone}
          onChange={(e) => onChange({
            ...formData,
            operator1: { ...formData.operator1, phone: e.target.value }
          })}
          required
        />
        <input
          className="input border-red-300 focus:ring-red-500"
          placeholder="Operator Name 2"
          value={formData.operator2.name}
          onChange={(e) => onChange({
            ...formData,
            operator2: { ...formData.operator2, name: e.target.value }
          })}
        />
        <input
          className="input border-red-300 focus:ring-red-500"
          placeholder="Operator Phone 2"
          value={formData.operator2.phone}
          onChange={(e) => onChange({
            ...formData,
            operator2: { ...formData.operator2, phone: e.target.value }
          })}
        />
        <button
          type="submit"
          disabled={loading}
          className="col-span-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Bus"}
        </button>
      </form>
    </div>
  );
};

export default AddBusForm;