import { Outlet } from "react-router-dom";
import Header from "../components/mainlayout/Header";
import Sidebar from "../components/mainlayout/LeftSidebar";
import RightSidebar from "../components/mainlayout/RightSidebar";
import "./MainLayout.css";

export default function MainLayout() {
  return (
    <div className="layout-root">
      <Header />

      <div className="layout-body">
        <Sidebar />

        <main className="layout-content">
          <Outlet />
        </main>

        <RightSidebar />
      </div>
    </div>
  );
}
