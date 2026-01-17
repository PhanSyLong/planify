import { BrowserRouter, Routes, Route } from "react-router-dom";

//sidebar
import Home from "./pages/Home.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import MyPlan from "./pages/MyPlan.jsx";
import Saved from "./pages/SavedPlan.jsx";
import Commu from "./pages/ExplorePage.jsx";
import Add from "./pages/CreatePlan.jsx";
import About from "./pages/About.jsx";

//header
import MyProfile from "./pages/MyProfile.jsx";

//other
import LoginSignup from "./pages/LoginSignup.jsx"
import Admin from "./pages/Admin.jsx";
import Notifications from "./components/header/Notification.jsx";

//view
import ViewPlan from "./components/myPlan/ViewPlan.jsx"
import ViewMyPlan from "./components/myPlan/ViewMyPlan.jsx"
import UserView from "./components/users/UserView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginSignup />} />

        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />

          {/* Nested routes for plans with context */}
          <Route path="/myplan">
            <Route index element={<MyPlan />} />
            <Route path="plans/:id" element={<ViewMyPlan/>} />
          </Route>

          <Route path="/saved">
            <Route index element={<Saved />} />
            <Route path="plans/:id" element={<ViewPlan />} />
          </Route>

          <Route path="/commu">
            <Route index element={<Commu />} />
            <Route path="plans/:id" element={<ViewPlan />} />
          </Route>

          <Route path="/add" element={<Add />} />
          <Route path="/myprofile" element={<MyProfile />} />
          <Route path="/about" element={<About/>} />

          {/* Fallback: direct access still works */}
          <Route path="/plans/:id" element={<ViewPlan />} />

          <Route path="/users/:userId" element={<UserView />} />

          {/*Notification */}
          <Route path="/notifications" element={<Notifications />} />
        </Route>

        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
