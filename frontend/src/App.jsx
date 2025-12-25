import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import MyPlan from "./pages/MyPlan.jsx";
import Saved from "./pages/SavedPlan.jsx";
import Commu from "./pages/ExplorePage.jsx";
import Add from "./pages/CreatePlan.jsx";
import MyProfile from "./pages/MyProfile.jsx";
import LoginSignup from "./pages/LoginSignup.jsx"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/myplan" element={<MyPlan />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/commu" element={<Commu />} />
          <Route path="/add" element={<Add />} />
          <Route path="/myprofile" element={<MyProfile />} />



          {/* Add more pages here */}
        </Route>
        <Route path="/logout" element={<LoginSignup/> } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
