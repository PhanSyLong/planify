import { Outlet } from "react-router-dom";
import { useEffect, useState,useRef } from "react";
import Header from "../components/mainlayout/Header";
import Sidebar from "../components/mainlayout/LeftSidebar";
import RightSidebar from "../components/mainlayout/RightSidebar";
import "./MainLayout.css";

export default function MainLayout() {
    const sseRef = useRef(null);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (sseRef.current) return;

        const es = new EventSource(
            "http://localhost:8080/planify/notifications/stream",
            { withCredentials: true }
        );

        es.addEventListener("notification", (e) => {
            const data = JSON.parse(e.data);

            const notif = {
                id: data.id,
                planId: data.planId,
                name: data.title,
                message: data.messageText,
                avatar: null,
                time: "just now",
                read: false,
                link: `/plans/${data.planId}`,
            };

            setNotifications((prev) => [notif, ...prev]);
        });

        es.onerror = () => es.close();
        return () => es.close();
    }, []);

    return (
        <div className="layout-root">
            <Header
                notifications={notifications}
                setNotifications={setNotifications}
            />

            <div className="layout-body">
                <Sidebar />
                <main className="layout-content">
                    <Outlet context={{ notifications, setNotifications }} />
                </main>
                <RightSidebar />
            </div>
        </div>
    );
}
