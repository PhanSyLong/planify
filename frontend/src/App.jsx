import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginSignup from "./pages/LoginSignup.jsx";

// Main layout và các page chính
import MainLayout from './layout/MainLayout.jsx';
import Home from './pages/Home.jsx';
import MyPlanPage from "./pages/MyPlanPage.jsx";
import SavedPage from "./pages/SavedPage";
import ExplorePage from "./pages/ExplorePage.jsx";
import CreatePlan from "./pages/CreatePlan.jsx";

// Detail plan
import PlanDetailPage from "./layout/PlanDetailPage.jsx";

// (nếu còn dùng)
import PlanPage from "./pages/PlanPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Trang Login/Signup - không dùng MainLayout */}
        <Route path="/" element={<LoginSignup />} />

        {/* Các trang chính có MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/plan" element={<MyPlanPage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/commu" element={<ExplorePage />} />
          <Route path="/add" element={<CreatePlan />} />

          {/* Detail plan */}
          <Route path="/plans/:id" element={<PlanDetailPage />} />

          {/* Các route khác nếu cần */}
        </Route>

        {/* Optional: Redirect từ root về /login nếu muốn login là trang đầu tiên */}
        {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;