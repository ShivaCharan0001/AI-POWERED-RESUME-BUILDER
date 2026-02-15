import React from "react";
import Navbar from "../Components/Navbar";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../Components/Loader";
import Login from "./Login";
// import Dashboard from "./dashboard";

const Layout = () => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <Loader />;
  }
  return (
    <div>
      {user ? ( //IF user is logged in, it shows the navbar and outlet ELSE Login page
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Outlet />
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
};

export default Layout;
