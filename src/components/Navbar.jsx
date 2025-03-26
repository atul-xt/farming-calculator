import React from "react";
import LanguageToggle from "./LanguageToggle";

const Navbar = () => {
  return (
    <div className="py-2 px-4 border-b border-gray-300 shadow-sm flex items-center justify-between">
      <img className="w-24" src="./images/LOGO.webp" alt="LOGO" />
      <LanguageToggle />
    </div>
  );
};

export default Navbar;
