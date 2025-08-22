import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import FeatureCard from "../components/FeatureCard";
import { features } from "../data/features";
import { FaSpinner } from "react-icons/fa";

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    setLoading(true);
    setTimeout(() => {
      navigate(path);
    }, 300); 
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Spinner Overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50">
          <FaSpinner className="text-indigo-600 text-7xl animate-spin" />
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Accounting System
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Manage your business finances with our comprehensive accounting solution.
          </p>
        </div>

        <div className="mt-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          {isAuthenticated ? (
            <button
              onClick={() => handleNavigation("/dashboard")}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Go to Dashboard
            </button>
          ) : (
            <button
              onClick={() => handleNavigation("/login")}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Get Started
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
