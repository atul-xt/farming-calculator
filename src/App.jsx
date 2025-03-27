import React from "react";
import Navbar from "./components/Navbar";
import MainSection from "./components/MainSection";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const App = () => {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar />
      <MainSection />
    </>
  );
};

export default App;
