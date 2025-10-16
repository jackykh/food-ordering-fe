import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate } from "react-router";

export default function HomePage() {
  const { userName, userId, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                Welcome, {userName}! 🎉
              </h1>
              <p className="text-gray-600 text-sm mt-1">User ID: {userId}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white px-4 py-2 rounded-lg transition self-start sm:self-auto"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Menu Button */}
            <button
              onClick={() => navigate("/menu")}
              className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white p-6 rounded-lg transition text-center cursor-pointer"
            >
              <div className="text-4xl mb-2">🍽️</div>
              <div className="font-semibold text-lg">View Menu</div>
              <div className="text-sm opacity-90 mt-1">
                Browse our delicious dishes
              </div>
            </button>

            {/* My Orders - Coming Soon */}
            <div className="bg-gray-200 text-gray-500 p-6 rounded-lg text-center cursor-not-allowed">
              <div className="text-4xl mb-2">🛒</div>
              <div className="font-semibold text-lg">My Orders</div>
              <div className="text-sm opacity-75 mt-1">Coming soon...</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
