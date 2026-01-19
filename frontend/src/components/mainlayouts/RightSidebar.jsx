import Calendar from "../rightsidebar/Calendar";
import TodayPieChart from "../rightsidebar/TodayPieChart";


export default function RightSidebar() {
  return (
    <aside
          style={{
            position: "fixed",
            top: "70px",                // ✅ dưới header
            right: 0,                   // ✅ sát phải
            width: "260px",             // ✅ đúng width
            height: "calc(100vh - 70px)",// ✅ phần còn lại
            backgroundColor: "#f5f7fa",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            overflowY: "auto",          // ✅ scroll nội dung
            borderLeft: "1px solid #e6e6e6",
            zIndex: 100,                // ✅ không bị che
          }}
        >
      {/* Calendar section*/}
      <section
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Calendar />
      </section>

      {/* Today performance section*/}
      <section
        style={{
          background: "#ffffff",
          borderRadius: "12px",
          padding: "12px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            fontSize: "14px",
            fontWeight: 600,
            marginBottom: "8px",
            color: "#333",
          }}
        >
          Today’s Performance
        </div>

        <TodayPieChart />
      </section>
    </aside>
  );
}
