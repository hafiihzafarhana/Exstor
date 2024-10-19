import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Explorer from "./components/Explorer";
import NotFoundPage from "../../../NotFound/NotFound";

const Right = () => {
  return (
    <div className="flex-1 p-[20px] bg-white">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explorer" element={<Explorer />} />
        <Route path="/explorer/:id" element={<Explorer />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};

export default Right;
