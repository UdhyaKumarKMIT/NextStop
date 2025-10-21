import React from "react";

const Feedbacks = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Customer Feedbacks</h2>
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-2">
            <span className="text-yellow-500">⭐ ⭐ ⭐ ⭐ ⭐</span>
            <span className="ml-2 text-sm text-gray-600">John Doe</span>
          </div>
          <p className="text-gray-700">"Great service, loved the comfort! The bus was clean and arrived on time."</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-2">
            <span className="text-yellow-500">⭐ ⭐ ⭐ ⭐</span>
            <span className="ml-2 text-sm text-gray-600">Sarah Smith</span>
          </div>
          <p className="text-gray-700">"Timings were accurate and the staff was very helpful. Will travel again!"</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-2">
            <span className="text-yellow-500">⭐ ⭐ ⭐ ⭐ ⭐</span>
            <span className="ml-2 text-sm text-gray-600">Mike Johnson</span>
          </div>
          <p className="text-gray-700">"Bus was clean and comfortable. The AC was working perfectly throughout the journey."</p>
        </div>
      </div>
    </div>
  );
};

export default Feedbacks;