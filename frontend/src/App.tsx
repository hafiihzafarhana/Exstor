import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import LoginPage from "./pages/Login/Login";
import RegisterPage from "./pages/Register/Register";
import DashboardPage from "./pages/Dashboard/Dashboard";
import NotFoundPage from "./pages/NotFound/NotFound";
import { ModalProvider } from "./contexts/ModalContext";
import ProtectedRoute from "./components/ProtectedRoute";
import RedirectIfAuthenticated from "./components/RedirectIfAuthenticated";

function App() {
  return (
    <AuthProvider>
      <ModalProvider>
        <Router>
          <Routes>
            <Route
              path="/login"
              element={
                <RedirectIfAuthenticated redirectTo="/">
                  <LoginPage />
                </RedirectIfAuthenticated>
              }
            />
            <Route
              path="/register"
              element={
                <RedirectIfAuthenticated redirectTo="/">
                  <RegisterPage />
                </RedirectIfAuthenticated>
              }
            />
            <Route
              path="/*"
              element={
                <ProtectedRoute redirectTo="/login">
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </ModalProvider>
    </AuthProvider>
  );
}

export default App;
