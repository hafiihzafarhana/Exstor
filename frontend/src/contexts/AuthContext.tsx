import React, { createContext, useEffect, useState } from "react";

// Interface untuk AuthContext yang menyertakan token, username, root_id
interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string, username: string, root_id: string) => void;
  logout: () => void;
  username: string | null; // Menyimpan username
  rootId: string | null; // Menyimpan root_id
}

// Membuat context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider untuk AuthContext
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [username, setUsername] = useState<string | null>(null);
  const [rootId, setRootId] = useState<string | null>(null);

  useEffect(() => {
    // Mengecek localStorage saat komponen pertama kali dimuat
    const token = localStorage.getItem("accessToken");
    const savedUsername = localStorage.getItem("username");
    const savedRootId = localStorage.getItem("rootId");

    if (token) {
      setIsAuthenticated(true);
      setUsername(savedUsername);
      setRootId(savedRootId);
    }

    setLoading(false); // Set loading false setelah pengecekan token selesai
  }, []);

  const login = (token: string, username: string, root_id: string) => {
    // Simpan informasi di localStorage dan set autentikasi
    localStorage.setItem("accessToken", token);
    localStorage.setItem("username", username);
    localStorage.setItem("rootId", root_id);
    setIsAuthenticated(true);
    setUsername(username);
    setRootId(root_id);
  };

  const logout = () => {
    // Hapus informasi dari localStorage dan reset status autentikasi
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
    localStorage.removeItem("rootId");
    sessionStorage.removeItem("copyPath");

    setIsAuthenticated(false);
    setUsername(null);
    setRootId(null);
  };

  if (loading) {
    return <div>Loading...</div>; // Tampilkan loading saat sedang memeriksa token
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, username, rootId }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
