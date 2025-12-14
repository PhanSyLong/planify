import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function MainLayout() {
  return (
    <div>
      <Header />

      <Sidebar />

      {/* CONTENT SHOULD START UNDER HEADER AND SIDE BAR */}
      <main
        style={{
          marginLeft: "70px", // sidebar width collapsed
          marginTop: "70px",  // header height
          padding: "20px",


        }}
      >
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
