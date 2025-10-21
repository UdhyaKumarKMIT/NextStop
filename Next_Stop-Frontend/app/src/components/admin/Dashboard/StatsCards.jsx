import React from "react";

const StatsCards = ({ buses, routes, admin }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 text-red-600">Total Buses</h3>
          <p className="text-3xl font-bold">{buses.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 text-green-600">Total Routes</h3>
          <p className="text-3xl font-bold">{routes.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 text-purple-600">Admin Role</h3>
          <p className="text-xl font-bold capitalize">{admin?.role}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;