import Header from "../components/mainlayouts/Header";
import LeftSidebar from "../components/mainlayouts/LeftSidebar";
import RightSidebar from "../components/mainlayouts/RightSidebar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <>
      <Header />
      <LeftSidebar />
      <RightSidebar />

      <main
        style={{
          marginTop: "70px",
          marginLeft: "70px",
          marginRight: "260px",
          minHeight: "calc(100vh - 70px)",
          padding: "24px",
          background: "#fafafa",
        }}
      >
        <Outlet />
      </main>
    </>
  );
}
