import { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Left from "./components/Left/Left";
import "./style.css";
import Right from "./components/Right/Right";

const DashboardPage = () => {
  const [sidebarWidth, setSidebarWidth] = useState(250); // Lebar sidebar default
  const handleMouseMove = (e: MouseEvent) => {
    setSidebarWidth(e.clientX); // Set lebar sidebar berdasarkan posisi mouse
  };

  const handleMouseUp = () => {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  const handleMouseDown = () => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Left width={sidebarWidth} />
        <div
          className="separator"
          onMouseDown={handleMouseDown} // Mulai drag saat mouse down
          style={{
            cursor: "ew-resize",
            width: "5px",
            backgroundColor: "#ccc",
          }} // Styling untuk separator
        />
        <Right />
      </div>
    </div>
  );
};

export default DashboardPage;
