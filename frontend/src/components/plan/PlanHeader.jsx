// src/components/plan/PlanHeader.jsx
export default function PlanHeader({ description, tags, duration }) {
  return (
    <div style={{
      maxWidth: "1100px",
      margin: "30px auto",
      background: "#f1f5f9",
      borderRadius: "24px",
      overflow: "hidden",
      boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
      display: "flex",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      {/* Ảnh trái – giữ nguyên */}
      <div style={{ width: "320px", flexShrink: 0, position: "relative", overflow: "hidden" }}>
        <div style={{
          height: "100%",
          background: "linear-gradient(to bottom, #87CEEB 0%, #B0E0E6 65%, #98FB98 100%)",
          position: "relative",
        }}>
          <div style={{ position: "absolute", top: "40px", left: "70px", width: "120px", height: "65px", background: "white", borderRadius: "60px", opacity: 0.95 }}></div>
          <div style={{ position: "absolute", top: "35px", left: "120px", width: "85px", height: "55px", background: "white", borderRadius: "60px", opacity: 0.95 }}></div>
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "150px", background: "#228B22", borderRadius: "50% 50% 0 0 / 80% 80% 0 0" }}></div>
          <div style={{ position: "absolute", bottom: "40px", left: 0, right: 0, height: "90px", background: "#90EE90", borderRadius: "50% 50% 0 0 / 100% 100% 0 0" }}></div>
        </div>
      </div>

      {/* Nội dung phải */}
      <div style={{ flex: 1, padding: "40px", display: "flex", flexDirection: "column", gap: "28px" }}>
        <div>
          <div style={{ marginBottom: "10px", color: "#4b5563", fontWeight: "600" }}>Description:</div>
          <div style={{
            background: "#d1d5db",
            borderRadius: "16px",
            padding: "22px 26px",
            minHeight: "110px",
            color: "#374151",
            fontSize: "1.05rem",
            lineHeight: "1.6",
          }}>
            {description}
          </div>
        </div>


        <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
          <span style={{ color: "#4b5563", fontWeight: "600" }}>Tag:</span>
          {tags.map((tag, i) => (
            <div
              key={i}
              style={{
                background: "#d1d5db",
                color: "gray",
                padding: "8px 20px",
                borderRadius: "999px",
                fontWeight: "bold",
                fontSize: "0.9rem",
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* Duration – giữ nguyên */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <span style={{ color: "#4b5563", fontWeight: "600" }}>Expected Duration:</span>
          <div style={{
            background: "#d1d5db",
            padding: "8px 22px",
            borderRadius: "12px",
            minWidth: "80px",
            textAlign: "center",
            fontWeight: "600",
            fontSize: "1.1rem",
          }}>
            {duration}
          </div>
          <span style={{ color: "#4b5563" }}>Days</span>
        </div>
      </div>
    </div>
  );
}