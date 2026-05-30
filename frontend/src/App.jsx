import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard.jsx";
import ResumeBuilder from "./pages/ResumeBuilder";
import Preview from "./pages/Preview";
import Login from "./pages/Login";
import { useAuth } from "./context/AuthContext.jsx";
import api from "./configs/api.js";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { login, setLoading } = useAuth();

  const getUserData = async () => {
    try {
      const { data } = await api.get("/api/users/data");
      if (data.user) {
        login({ user: data.user });
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };

  // ^ Calling getUserData when component gets loaded
  useEffect(() => {
    getUserData();
  }, []);

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="app" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="builder/:resumeId" element={<ResumeBuilder />} />
        </Route>
        <Route path="view/:resumeId" element={<Preview />} />
        <Route path="login" element={<Login />} />
      </Routes>
    </>
  );
};

export default App;
