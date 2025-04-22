// DarkModeToggle.jsx
import { useState, useEffect } from "react";

const DarkModeToggle = () => {
  // Get initial dark mode preference from localStorage, default to false
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("theme");
    return savedMode === "dark";
  });

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  // Apply dark mode class on the html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 bg-gray-300 dark:bg-gray-800 text-black dark:text-white rounded"
    >
      Toggle Dark Mode
    </button>
  );
};

export default DarkModeToggle;
