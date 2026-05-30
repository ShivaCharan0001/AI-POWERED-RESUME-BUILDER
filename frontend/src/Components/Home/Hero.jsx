import React from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { Link } from "react-router-dom";

const Hero = () => {
  const { user } = useAuth();

  return (
    <section className="bg-linear-to-b from-[#D9D9FF] to-[#F8F3F9] px-4 pt-8 pb-8">
      
      {/* NAVBAR */}
      <nav className="flex items-center justify-between bg-white/60 backdrop-blur border border-white rounded-full px-4 sm:px-6 py-3 w-full max-w-4xl mx-auto gap-2">
        <h1 className="text-lg sm:text-2xl font-semibold text-gray-900 whitespace-nowrap">
          Resume Builder
        </h1>

        <div className="flex items-center gap-2 sm:gap-4">
          {!user ? (
            <>
              <Link
                to="/app?state=register"
                className="bg-linear-to-r from-purple-600 to-indigo-600 text-white px-3 py-1.5 sm:px-6 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition whitespace-nowrap active:scale-95"
              >
                Get Started
              </Link>
              <Link
                to="/app?state=login"
                className="bg-linear-to-r from-purple-600 to-indigo-600 text-white px-3 py-1.5 sm:px-6 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition whitespace-nowrap active:scale-95"
              >
                Login
              </Link>
            </>
          ) : (
            <Link
              to="/app"
              className="bg-linear-to-r from-purple-600 to-indigo-600 text-white px-4 py-1.5 sm:px-6 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition whitespace-nowrap active:scale-95"
            >
              Dashboard
            </Link>
          )}
        </div>
      </nav>

      {/* HERO CONTENT */}
      <div className="max-w-4xl mx-auto text-center mt-24">
        <h1 className="text-4xl md:text-6xl font-semibold text-gray-800 leading-tight">
          Land your dream job with
          <br />
          <span className="text-purple-600">
            clean resumes.
          </span>
        </h1>

        <p className="mt-6 text-base text-gray-600 max-w-2xl mx-auto">
          Create, edit and download professional resumes in minutes.
        </p>
      </div>

    </section>
  );
};

export default Hero;
