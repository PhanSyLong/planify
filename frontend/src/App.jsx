import { BrowserRouter, Routes, Route } from "react-router-dom";

//mainlayout
import MainLayout from "./layouts/MainLayout";

//logsign
import LogSign from "./pages/LoginSignup";

//sidebar
import Home from "./pages/Home";
import MyPlan from "./pages/MyPlan";
import SavedPlan from "./pages/SavedPlan";
import Commu from "./pages/ExplorePage";
import Add from "./pages/CreatePlan";
import About from "./pages/About.jsx";

// Profile Pages
import MyProfile from "./pages/MyProfile";
import OtherUser from "./pages/OtherUser";

//plan
import ViewPlan from "./components/plans/ViewPlan.jsx";
import ViewMyPlan from "./components/plans/ViewMyPlan.jsx";
import UserView from "./components/users/UserView";
import Notification from "./components/mainlayout/Notification.jsx"
import "./App.css";

//fork
import ForkPlan from "./components/fork&edit/ForkPlan.jsx"
//
import Admin from "./pages/Admin.jsx";
import ViewPlanWrapper from "./components/plans/ViewPlanWrapper.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route>
            <Route path="/home" element={<Home />} />
            <Route path="/add" element={<Add />} />


            {/* Profile Routes */}
            <Route path="/myprofile" element={<MyProfile />} />
            <Route path="/profile/:id" element={<OtherUser />} />

            {/* MyPlan Routes */}
            <Route path="/myplan" element={<MyPlan />} />
            <Route path="/myplan/plans/:id" element={<ViewMyPlan />} />


            {/* Saved Plan Routes */}
            <Route path="/saved" element={<SavedPlan />} />
            <Route path="/saved/plans/:id" element={<ViewPlan />} />
            <Route path="/plans/:id/fork" element={<ForkPlan />} />

            {/* Community/Explore Routes */}
            <Route path="/commu" element={<Commu />} />
            <Route path="/commu/plans/:id" element={<ViewPlan />} />

            {/* Unified Plan View Route - Smart wrapper that shows ViewMyPlan or ViewPlan */}
            <Route path="/plans/:id" element={<ViewPlanWrapper />} />

            <Route path="/about" element={<About />} />
            <Route path="/notifications" element={<Notification />} />
          </Route>

        </Route>
        <Route path="/" element={<LogSign />} />
        <Route path="/admin" element={<Admin />} />

      </Routes>
    </BrowserRouter>
  );
}