"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleLanguage } from "../../Redux/slices/languageSlice";
const LanguageToggle = () => {
  const language = useSelector((state) => state.language.language);
  const dispatch = useDispatch();

  const toggleLanguage1 = () => {
    dispatch(toggleLanguage());
  };

  return (
    <button
      onClick={toggleLanguage1}
      className="relative flex items-center w-32 h-12 rounded-full bg-gray-200 shadow-sm transition-all duration-300"
      aria-label={`Switch to ${
        language === "en" ? "Hindi" : "English"
      } language`}
    >
      {/* Background pill */}
      <div className="absolute inset-0.5 rounded-full bg-white shadow-inner"></div>

      {/* Sliding indicator */}
      <div
        className={`absolute h-10 w-20 rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out ${
          language === "en" ? "translate-x-11" : "translate-x-1"
        }`}
      ></div>

      {/* Hindi Option (Left) */}
      <div
        className={`absolute left-2 flex items-center transition-opacity duration-300 ${
          language === "hi" ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="w-7 h-7 rounded-full overflow-hidden shadow-sm">
          <div className="w-full h-full relative">
            <div className="absolute inset-0 flex flex-col">
              <div className="h-1/3 bg-orange-500"></div>
              <div className="h-1/3 bg-white flex items-center justify-center">
                <div className="w-2 h-2 rounded-full border border-blue-900"></div>
              </div>
              <div className="h-1/3 bg-green-600"></div>
            </div>
          </div>
        </div>
        <span className="ml-1 text-gray-600 font-medium text-base">हिन्दी</span>
      </div>

      {/* English Option (Right) */}
      <div
        className={`absolute right-2 flex items-center transition-opacity duration-300 ${
          language === "en" ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="mr-1 text-gray-600 font-medium text-base">ENG</span>
        <div className="w-7 h-7 rounded-full overflow-hidden shadow-sm">
          <div className="w-full h-full relative">
            <div className="absolute inset-0 bg-blue-800">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-1.5 bg-white"></div>
                <div className="h-full w-1.5 bg-white"></div>
              </div>
              <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-1/2 h-1/2 overflow-hidden">
                  <div className="absolute h-[141%] w-1 bg-red-600 origin-bottom-right rotate-45 translate-x-0.5"></div>
                </div>
                <div className="absolute top-0 right-0 w-1/2 h-1/2 overflow-hidden">
                  <div className="absolute h-[141%] w-1 bg-red-600 origin-bottom-left rotate-[-45deg] translate-x-[-0.5px]"></div>
                </div>
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 overflow-hidden">
                  <div className="absolute h-[141%] w-1 bg-red-600 origin-top-right rotate-[-45deg] translate-x-0.5"></div>
                </div>
                <div className="absolute bottom-0 right-0 w-1/2 h-1/2 overflow-hidden">
                  <div className="absolute h-[141%] w-1 bg-red-600 origin-top-left rotate-45 translate-x-[-0.5px]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
};

export default LanguageToggle;
