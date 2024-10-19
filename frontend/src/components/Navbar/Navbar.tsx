import React, { useEffect, useRef, useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
const Navbar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev); // Toggle dropdown
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false); // Tutup dropdown jika klik di luar
      }
    };

    document.addEventListener("mousedown", handleOutsideClick); // Tambahkan listener saat klik
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick); // Hapus listener saat komponen di-unmount
    };
  }, []);

  const username = localStorage.getItem("username");

  return (
    <nav className="bg-white shadow-md relative">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold">EXSTOR</div>
        <div className="flex space-x-4">
          <div
            className="text-gray-600 hover:shadow-md hover:rounded-full"
            onClick={toggleDropdown}
          >
            <FaRegUserCircle size={36} />
          </div>
          {isDropdownOpen && (
            <div
              ref={dropdownRef} // Menghubungkan referensi ke elemen dropdown
              className="absolute right-10 top-10 mt-2 w-48 bg-white shadow-lg rounded-md z-10"
            >
              <ul className="py-1">
                <li>
                  <div className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Hi, {username}
                  </div>
                </li>
                <li>
                  <button
                    onClick={() => {
                      console.log("Logging out...");
                      logout();
                      navigate("/login");
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
