import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ModalProvider } from "./contexts/ModalContext";
import ProtectedRoute from "./components/ProtectedRoute";
import RedirectIfAuthenticated from "./components/RedirectIfAuthenticated";
import { Suspense, lazy } from "react";

const LoginPage = lazy(() => import("./pages/Login/Login"));
const RegisterPage = lazy(() => import("./pages/Register/Register"));
const DashboardPage = lazy(() => import("./pages/Dashboard/Dashboard"));
const NotFoundPage = lazy(() => import("./pages/NotFound/NotFound"));

function App() {
  return (
    <AuthProvider>
      <ModalProvider>
        <Router>
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-screen">
                <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
              </div>
            }
          >
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
          </Suspense>
        </Router>
      </ModalProvider>
    </AuthProvider>
  );
}

export default App;
