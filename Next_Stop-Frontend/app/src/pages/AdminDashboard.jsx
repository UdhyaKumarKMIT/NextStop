import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://4.188.80.153:5050/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("admin");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("addBus");
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [admin, setAdmin] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const navigate = useNavigate();

  // Form states
  const [busForm, setBusForm] = useState({
    busNumber: "",
    busName: "",
    type: "AC",
    routeId: "",
    totalSeats: 40,
    operator1: { name: "", phone: "" },
    operator2: { name: "", phone: "" }
  });

  const [routeForm, setRouteForm] = useState({
    routeId: "",
    source: "",
    destination: "",
    distance: "",
    duration: "",

  });

  const [updateBusForm, setUpdateBusForm] = useState({
    busName: "",
    type: "AC",
    routeId: "",
    totalSeats: 40,
    operator1: { name: "", phone: "" },
    operator2: { name: "", phone: "" }
  });

  const [updateRouteForm, setUpdateRouteForm] = useState({
    source: "",
    destination: "",
    distance: "",
    duration: "",
    fare: ""
  });

  const [deleteBusNumber, setDeleteBusNumber] = useState("");
  const [deleteRouteId, setDeleteRouteId] = useState("");
  const [updateBusNumber, setUpdateBusNumber] = useState("");
  const [updateRouteId, setUpdateRouteId] = useState("");

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const adminData = localStorage.getItem("admin");
    
    if (!token || !adminData) {
      navigate("/admin/login");
      return;
    }

    setAdmin(JSON.parse(adminData));
    fetchBuses();
    fetchRoutes();
    fetchFeedbacks();
  }, [navigate]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  // Bus API functions
  const fetchBuses = async () => {
    try {
      const response = await api.get("/buses");
      setBuses(response.data.buses || []);
    } catch (error) {
      console.error("Error fetching buses:", error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const handleFetchBus = async () => {
  if (!updateBusNumber.trim()) {
    showMessage("error", "Please enter a bus number to search");
    return;
  }
  setLoading(true);
  try {
    const response = await api.get(`/buses/${updateBusNumber}`);
    const bus = response.data.bus;

    setUpdateBusForm({
      busName: bus.busName || "",
      type: bus.type || "AC",
      routeId: bus.routeId || "",
      totalSeats: bus.totalSeats || 40,
       operator1: {
        name: bus.operatorName1 || "",
        phone: bus.operatorPhone1 || ""
      },
      operator2: {
        name: bus.operatorName2 || "",
        phone: bus.operatorPhone2 || ""
      },
    });

    showMessage("success", "Bus data loaded. You can edit now!");
  } catch (err) {
    showMessage("error", err.response?.data?.message || "Bus not found");
  } finally {
    setLoading(false);
  }
};



  const fetchRoutes = async () => {
    try {
      const response = await api.get("/routes");
      setRoutes(response.data.routes || []);
    } catch (error) {
      console.error("Error fetching routes:", error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };


  const fetchFeedbacks = async () => {
  try {
    const response = await api.get("/feedbacks/getfeedbacks");
    setFeedbacks(response.data.feedbacks || []);
  } catch (err) {
    console.error("Error fetching feedbacks:", err);
  }
};



  const handleAddBus = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {

      const payload = {
      ...busForm,
      operatorName1: busForm.operator1.name,
      operatorPhone1: busForm.operator1.phone,
      operatorName2: busForm.operator2.name || null,
      operatorPhone2: busForm.operator2.phone || null,
    };

    await api.post("/buses/add", payload);
    showMessage("success", "Bus added successfully!");
    setBusForm({
      busNumber: "",
      busName: "",
        type: "AC",
        routeId: "",
        totalSeats: 40,
        operator1: { name: "", phone: "" },
        operator2: { name: "", phone: "" }
      });
      fetchBuses();
    } catch (error) {
      showMessage("error", error.response?.data?.message || "Failed to add bus");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBus = async () => {
    if (!deleteBusNumber.trim()) {
      showMessage("error", "Please enter a bus number");
      return;
    }

    setLoading(true);
    try {
      await api.delete(`/buses/${deleteBusNumber}`);
      showMessage("success", "Bus deleted successfully!");
      setDeleteBusNumber("");
      fetchBuses();
    } catch (error) {
      showMessage("error", error.response?.data?.message || "Failed to delete bus");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBus = async (e) => {
    e.preventDefault();
    if (!updateBusNumber.trim()) {
      showMessage("error", "Please enter a bus number to update");
      return;
    }

    setLoading(true);
    try {
      await api.put(`/buses/${updateBusNumber}`, updateBusForm);
      showMessage("success", "Bus updated successfully!");
      setUpdateBusNumber("");
      setUpdateBusForm({
        busName: "",
        type: "AC",
        routeId: "",
        totalSeats: 40,
        operator1: { name: "", phone: "" }
      });
      fetchBuses();
    } catch (error) {
      showMessage("error", error.response?.data?.message || "Failed to update bus");
    } finally {
      setLoading(false);
    }
  };

  // Route API functions
  const handleAddRoute = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/routes", routeForm);
      showMessage("success", "Route added successfully!");
      setRouteForm({
        routeId: "",
        source: "",
        destination: "",
        distance: "",
        duration: "",
        fare: ""
      });
      fetchRoutes();
    } catch (error) {
      showMessage("error", error.response?.data?.message || "Failed to add route");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoute = async () => {
    if (!deleteRouteId.trim()) {
      showMessage("error", "Please enter a route ID");
      return;
    }

    setLoading(true);
    try {
      await api.delete(`/routes/${deleteRouteId}`);
      showMessage("success", "Route deleted successfully!");
      setDeleteRouteId("");
      fetchRoutes();
    } catch (error) {
      showMessage("error", error.response?.data?.message || "Failed to delete route");
    } finally {
      setLoading(false);
    }
  };


  const handleFetchRoute = async () => {
  if (!updateRouteId.trim()) {
    showMessage("error", "Please enter a route ID to fetch");
    return;
  }

  setLoading(true);
  try {
    const res = await api.get(`/routes/${updateRouteId}`);
    const route = res.data.route;

    if (!route) {
      showMessage("error", "Route not found");
      return;
    }

    // ✅ Prefill update form fields
    setUpdateRouteForm({
      source: route.source || "",
      destination: route.destination || "",
      distance: route.distance || "",
      duration: route.duration || "",
    });

    showMessage("success", "Route fetched successfully!");
  } catch (error) {
    console.error("Error fetching route:", error);
    showMessage("error", error.response?.data?.message || "Failed to fetch route");
  } finally {
    setLoading(false);
  }
};




  const handleUpdateRoute = async (e) => {
    e.preventDefault();
    if (!updateRouteId.trim()) {
      showMessage("error", "Please enter a route ID to update");
      return;
    }

    setLoading(true);
    try {
      await api.put(`/routes/${updateRouteId}`, updateRouteForm);
      showMessage("success", "Route updated successfully!");
      setUpdateRouteId("");
      setUpdateRouteForm({
        source: "",
        destination: "",
        distance: "",
        duration: "",
      });
      fetchRoutes();
    } catch (error) {
      showMessage("error", error.response?.data?.message || "Failed to update route");
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "addBus":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Add New Bus</h2>
            <form onSubmit={handleAddBus} className="grid grid-cols-2 gap-4">
              <input
                className="input border-red-300 focus:ring-red-500"
                placeholder="Bus Number"
                value={busForm.busNumber}
                onChange={(e) => setBusForm({ ...busForm, busNumber: e.target.value })}
                required
              />
              <input
                className="input border-red-300 focus:ring-red-500"
                placeholder="Bus Name"
                value={busForm.busName}
                onChange={(e) => setBusForm({ ...busForm, busName: e.target.value })}
                required
              />
              <select
                className="input border-red-300 focus:ring-red-500"
                value={busForm.type}
                onChange={(e) => setBusForm({ ...busForm, type: e.target.value })}
              >
                <option>AC</option>
                <option>Non-AC</option>
                <option>Sleeper</option>
              </select>
              <input
                className="input border-red-300 focus:ring-red-500"
                placeholder="Route ID"
                value={busForm.routeId}
                onChange={(e) => setBusForm({ ...busForm, routeId: e.target.value })}
                required
              />
              <input
                className="input border-red-300 focus:ring-red-500"
                placeholder="Total Seats"
                type="number"
                value={busForm.totalSeats}
                onChange={(e) => setBusForm({ ...busForm, totalSeats: e.target.value })}
                required
              />
              <input
                className="input border-red-300 focus:ring-red-500"
                placeholder="Operator Name 1"
                value={busForm.operator1.name}
                onChange={(e) => setBusForm({
                  ...busForm,
                  operator1: { ...busForm.operator1, name: e.target.value }
                })}
                required
              />
              <input
                className="input border-red-300 focus:ring-red-500"
                placeholder="Operator Phone 1"
                value={busForm.operator1.phone}
                onChange={(e) => setBusForm({
                  ...busForm,
                  operator1: { ...busForm.operator1, phone: e.target.value }
                })}
                required
              />
              <input
                className="input border-red-300 focus:ring-red-500"
                placeholder="Operator Name 2"
                value={busForm.operator2.name}
                onChange={(e) => setBusForm({
                  ...busForm,
                  operator2: { ...busForm.operator2, name: e.target.value }
                })}
              />
              <input
                className="input border-red-300 focus:ring-red-500"
                placeholder="Operator Phone 2"
                value={busForm.operator2.phone}
                onChange={(e) => setBusForm({
                  ...busForm,
                  operator2: { ...busForm.operator2, phone: e.target.value }
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

      case "removeBus":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Remove Bus</h2>
            <div className="space-y-4">
              <input
                className="input border-red-300 focus:ring-red-500 w-1/2"
                placeholder="Enter Bus Number"
                value={deleteBusNumber}
                onChange={(e) => setDeleteBusNumber(e.target.value)}
              />
              <button
                onClick={handleDeleteBus}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete Bus"}
              </button>
            </div>
          </div>
        );

      case "updateBus":
        return (
          <div>
  <h2 className="text-2xl font-bold mb-4">Update Bus Details</h2>

  {/* Search Bus */}
  <div className="flex items-center space-x-2 mb-4">
    <input
      className="input border-red-300 focus:ring-red-500 w-1/2"
      placeholder="Bus Number to Update"
      value={updateBusNumber}
      onChange={(e) => setUpdateBusNumber(e.target.value)}
    />
    <button
      type="button"
      onClick={handleFetchBus}
      className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
    >
      {loading ? "Loading..." : "Search"}
    </button>
  </div>

  {/* Update Form */}
  <form onSubmit={handleUpdateBus} className="grid grid-cols-2 gap-4">
    <input
      className="input border-red-300 focus:ring-red-500"
      placeholder="Bus Name"
      value={updateBusForm.busName}
      onChange={(e) => setUpdateBusForm({ ...updateBusForm, busName: e.target.value })}
    />
    <select
      className="input border-red-300 focus:ring-red-500"
      value={updateBusForm.type}
      onChange={(e) => setUpdateBusForm({ ...updateBusForm, type: e.target.value })}
    >
      <option>AC</option>
      <option>Non-AC</option>
      <option>Sleeper</option>
    </select>
    <input
      className="input border-red-300 focus:ring-red-500"
      placeholder="Route ID"
      value={updateBusForm.routeId}
      onChange={(e) => setUpdateBusForm({ ...updateBusForm, routeId: e.target.value })}
    />
    <input
      className="input border-red-300 focus:ring-red-500"
      placeholder="Total Seats"
      type="number"
      value={updateBusForm.totalSeats}
      onChange={(e) => setUpdateBusForm({ ...updateBusForm, totalSeats: e.target.value })}
    />

    <input
      className="input border-red-300 focus:ring-red-500"
      placeholder="Operator Name 1"
      value={updateBusForm.operator1?.name || ""}
      onChange={(e) => setUpdateBusForm({ ...updateBusForm, operator1: { ...updateBusForm.operator1, name: e.target.value } })}
    />
    <input
      className="input border-red-300 focus:ring-red-500"
      placeholder="Operator Phone 1"
      value={updateBusForm.operator1?.phone || ""}
      onChange={(e) => setUpdateBusForm({ ...updateBusForm, operator1: { ...updateBusForm.operator1, phone: e.target.value } })}
    />
    <input
      className="input border-red-300 focus:ring-red-500"
      placeholder="Operator Name 2"
      value={updateBusForm.operator2?.name || ""}
      onChange={(e) => setUpdateBusForm({ ...updateBusForm, operator2: { ...updateBusForm.operator2, name: e.target.value } })}
    />
    <input
      className="input border-red-300 focus:ring-red-500"
      placeholder="Operator Phone 2"
      value={updateBusForm.operator2?.phone || ""}
      onChange={(e) => setUpdateBusForm({ ...updateBusForm, operator2: { ...updateBusForm.operator2, phone: e.target.value } })}
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
        );

      case "addRoute":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Add Route</h2>
            <form onSubmit={handleAddRoute} className="grid grid-cols-2 gap-4">
              <input
                className="input border-red-300 focus:ring-red-500"
                placeholder="Route ID"
                value={routeForm.routeId}
                onChange={(e) => setRouteForm({ ...routeForm, routeId: e.target.value })}
                required
              />
              <input
                className="input border-red-300 focus:ring-red-500"
                placeholder="Source"
                value={routeForm.source}
                onChange={(e) => setRouteForm({ ...routeForm, source: e.target.value })}
                required
              />
              <input
                className="input border-red-300 focus:ring-red-500"
                placeholder="Destination"
                value={routeForm.destination}
                onChange={(e) => setRouteForm({ ...routeForm, destination: e.target.value })}
                required
              />
              <input
                className="input border-red-300 focus:ring-red-500"
                placeholder="Distance (km)"
                type="number"
                value={routeForm.distance}
                onChange={(e) => setRouteForm({ ...routeForm, distance: e.target.value })}
                required
              />
              <input
                className="input border-red-300 focus:ring-red-500"
                placeholder="Duration (e.g. 4h 30m)"
                value={routeForm.duration}
                onChange={(e) => setRouteForm({ ...routeForm, duration: e.target.value })}
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

      case "deleteRoute":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Delete Route</h2>
            <div className="space-y-4">
              <input
                className="input border-red-300 focus:ring-red-500 w-1/2"
                placeholder="Enter Route ID"
                value={deleteRouteId}
                onChange={(e) => setDeleteRouteId(e.target.value)}
              />
              <button
                onClick={handleDeleteRoute}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete Route"}
              </button>
            </div>
          </div>
        );

      case "updateRoute":
       case "updateRoute":
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Update Route Details</h2>

      {/* 🔍 Search Route Section */}
      <div className="flex items-center space-x-2 mb-4">
        <input
          className="input border-red-300 focus:ring-red-500 w-1/2"
          placeholder="Enter Route ID to Update"
          value={updateRouteId}
          onChange={(e) => setUpdateRouteId(e.target.value)}
        />
        <button
          type="button"
          onClick={handleFetchRoute}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      {/* ✏️ Update Route Form */}
      <form onSubmit={handleUpdateRoute} className="grid grid-cols-2 gap-4">
        <input
          className="input border-red-300 focus:ring-red-500"
          placeholder="Source"
          value={updateRouteForm.source}
          onChange={(e) =>
            setUpdateRouteForm({ ...updateRouteForm, source: e.target.value })
          }
        />
        <input
          className="input border-red-300 focus:ring-red-500"
          placeholder="Destination"
          value={updateRouteForm.destination}
          onChange={(e) =>
            setUpdateRouteForm({ ...updateRouteForm, destination: e.target.value })
          }
        />
        <input
          className="input border-red-300 focus:ring-red-500"
          placeholder="Distance (km)"
          type="number"
          value={updateRouteForm.distance}
          onChange={(e) =>
            setUpdateRouteForm({ ...updateRouteForm, distance: e.target.value })
          }
        />
        <input
          className="input border-red-300 focus:ring-red-500"
          placeholder="Duration (e.g. 6h 30m)"
          value={updateRouteForm.duration}
          onChange={(e) =>
            setUpdateRouteForm({ ...updateRouteForm, duration: e.target.value })
          }
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
  );


      case "feedbacks":
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Customer Feedbacks</h2>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {feedbacks.length > 0 ? (
          feedbacks.map((fb) => (
            <div key={fb._id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center mb-2">
                <span className="text-yellow-500">
                  {"⭐".repeat(fb.rating)}
                </span>
                <span className="ml-2 text-sm text-gray-600">{fb.user?.username}</span>
              </div>
              <p className="text-gray-700">{fb.comment}</p>
              {fb.bus && (
                <p className="text-xs text-gray-500">
                  Bus: {fb.bus.busNumber} ({fb.bus.busName})
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">No feedbacks found</p>
        )}
      </div>
    </div>
  );

      default:
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
    }
  };

  if (!admin) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-red-50 text-gray-900 flex flex-col">
      {/* Navbar */}
      <nav className="bg-red-700 text-white px-6 py-3 flex justify-between items-center shadow-md">
        <div>
          <h1 className="text-xl font-bold tracking-wide">NextStop Admin Dashboard</h1>
          <p className="text-sm text-red-200">Welcome, {admin.username} ({admin.role})</p>
        </div>
        <button 
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-800 px-4 py-2 rounded-md transition"
        >
          Logout
        </button>
      </nav>

      {/* Message Display */}
      {message.text && (
        <div className={`mx-6 mt-4 p-4 rounded-lg ${
          message.type === "success" 
            ? "bg-green-100 text-green-800 border border-green-200" 
            : "bg-red-100 text-red-800 border border-red-200"
        }`}>
          {message.text}
        </div>
      )}

      {/* Dashboard Layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-red-100 border-r border-red-300 p-4 space-y-2">
          {[
            ["Dashboard", "dashboard"],
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
              className={`w-full text-left px-4 py-3 rounded-md font-medium transition ${
                activeTab === key
                  ? "bg-red-600 text-white shadow-md"
                  : "hover:bg-red-200 text-red-800 hover:shadow"
              }`}
            >
              {label}
            </button>
          ))}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {renderContent()}
          
          {/* Data Overview */}
          {(activeTab === "dashboard" || activeTab === "feedbacks") && (
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
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;