import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginSignup from "./pages/LoginSignup.jsx";

//main
import MainLayout from './layout/MainLayout.jsx';

//page
import Home from './pages/Home.jsx';
import MyPlanPage from "./pages/MyPlanPage.jsx";
import SavedPage from "./pages/SavedPage";
import ExplorePage from "./pages/ExplorePage.jsx";
import CreatePlan from "./pages/CreatePlan.jsx";

//detail plan, just for demo
import PlanDetailPage from "./layout/PlanDetailPage.jsx";

//idk
import PlanPage from "./pages/PlanPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout/>}>
          <Route path="/" element={<Home/>} />
          <Route path="/plan" element={<MyPlanPage/>} />
          <Route path="/saved" element={<SavedPage/>} />
          <Route path="/commu" element={<ExplorePage />} />
          <Route path="/add" element={<CreatePlan/>} />  {/* testing login signup */}

          {/*detailplan*/}
          <Route path="/plans/:id" element={<PlanDetailPage />} />


        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

