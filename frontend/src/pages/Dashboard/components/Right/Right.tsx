import { Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";

// Lazy load the components
const Home = lazy(() => import("./components/Home"));
const Explorer = lazy(() => import("./components/Explorer"));
const NotFoundPage = lazy(() => import("../../../NotFound/NotFound"));

const Right = () => {
  return (
    <div className="flex-1 p-[20px] bg-white">
      {/* Suspense fallback is provided while components load */}
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-screen">
            <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explorer" element={<Explorer />} />
          <Route path="/explorer/:id" element={<Explorer />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default Right;
