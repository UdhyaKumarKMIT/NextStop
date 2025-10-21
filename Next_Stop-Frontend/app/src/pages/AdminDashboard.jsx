import React, { useState } from "react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("addBus");

  const renderContent = () => {
    switch (activeTab) {
      case "addBus":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Add New Bus</h2>
            <form className="grid grid-cols-2 gap-4">
              <input className="input" placeholder="Bus Number" />
              <input className="input" placeholder="Bus Name" />
              <select className="input">
                <option>AC</option>
                <option>Non-AC</option>
                <option>Sleeper</option>
              </select>
              <input className="input" placeholder="Route ID" />
              <input className="input" placeholder="Operator Name 1" />
              <input className="input" placeholder="Operator Phone 1" />
              <input className="input" placeholder="Operator Name 2" />
              <input className="input" placeholder="Operator Phone 2" />
              <button className="col-span-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition">
  Add Bus
</button>

            </form>
          </div>
        );

      case "removeBus":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Remove Bus</h2>
            <input className="input w-1/2" placeholder="Enter Bus Number" />
            <button className="col-span-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition">
  Delete Bus
</button>

          </div>
        );

      case "updateBus":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Update Bus Details</h2>
            <input className="input w-1/2 mb-3" placeholder="Bus Number" />
            <form className="grid grid-cols-2 gap-4">
              <input className="input" placeholder="Bus Name" />
              <select className="input">
                <option>AC</option>
                <option>Non-AC</option>
                <option>Sleeper</option>
              </select>
              <input className="input" placeholder="Route ID" />
              <input className="input" placeholder="Operator Name 1" />
              <input className="input" placeholder="Operator Phone 1" />
              <button className="col-span-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition">
  Update Bus
</button>

            </form>
          </div>
        );

      case "addRoute":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Add Route</h2>
            <form className="grid grid-cols-2 gap-4">
              <input className="input" placeholder="Route ID" />
              <input className="input" placeholder="Source" />
              <input className="input" placeholder="Destination" />
              <input className="input" placeholder="Distance (km)" />
              <input className="input" placeholder="Duration (e.g. 4h 30m)" />
              <button className="col-span-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition">
  Add Route
</button>

            </form>
          </div>
        );

      case "deleteRoute":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Delete Route</h2>
            <input className="input w-1/2" placeholder="Enter Route ID" />
            <button className="col-span-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition">
  Delete Route
</button>

          </div>
        );

      case "updateRoute":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Update Route</h2>
            <input className="input w-1/2 mb-3" placeholder="Route ID" />
            <form className="grid grid-cols-2 gap-4">
              <input className="input" placeholder="Source" />
              <input className="input" placeholder="Destination" />
              <input className="input" placeholder="Distance (km)" />
              <input className="input" placeholder="Duration" />
              <button className="col-span-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition">
  Update Route
</button>

            </form>
          </div>
        );

      case "feedbacks":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Customer Feedbacks</h2>
            <div className="bg-white/10 p-4 rounded-lg">
              <p className="mb-2">⭐ "Great service, loved the comfort!"</p>
              <p className="mb-2">⭐ "Timings were accurate!"</p>
              <p>⭐ "Bus was clean and comfortable."</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-red-50 text-gray-900 flex flex-col">
      {/* Navbar */}
      <nav className="bg-red-700 text-white px-6 py-3 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold tracking-wide">NextStop Admin</h1>
        <button className="hover:bg-red-600 px-4 py-2 rounded-md">Logout</button>
      </nav>

      {/* Dashboard Layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-60 bg-red-100 border-r border-red-300 p-4 space-y-2">
          {[
            ["Add Bus", "addBus"],
            ["Remove Bus", "removeBus"],
            ["Update Bus", "updateBus"],
            ["Add Route", "addRoute"],
            ["Delete Route", "deleteRoute"],
            ["Update Route", "updateRoute"],
            ["View Feedbacks", "feedbacks"],
          ].map(([label, key]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`w-full text-left px-4 py-2 rounded-md font-medium transition ${
                activeTab === key
                  ? "bg-red-600 text-white"
                  : "hover:bg-red-200 text-red-800"
              }`}
            >
              {label}
            </button>
          ))}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">{renderContent()}</main>
      </div>
    </div>
  );
};

// Tailwind helper styles
const style = `
.input {
  @apply border border-red-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-red-500 outline-none;
}
.btn {
  @apply bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition;
}
`;
export default AdminDashboard;
