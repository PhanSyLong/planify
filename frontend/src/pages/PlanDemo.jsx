import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleDown } from '@fortawesome/free-solid-svg-icons';

// ==================== MOCK DATA EMBEDDED ====================
const planData = {
  title: "Hệ thống quản lý bán hàng đa kênh tích hợp AI",
  description:
    "Xây dựng hệ thống quản lý bán hàng đa kênh tích hợp AI, giúp tự động hóa quy trình từ đơn hàng đến kho vận, đồng bộ tồn kho realtime, phân tích hành vi khách hàng và đề xuất sản phẩm thông minh.",
  tags: ["In Progress", "E-commerce", "AI & Automation"],
  duration: 45,

  stages: [
    {
      id: "s1",
      title: "Giai đoạn 1: Khởi tạo dự án & Thu thập yêu cầu",
      description: "Khởi động dự án, làm rõ yêu cầu từ các bên liên quan và xây dựng tài liệu nền tảng.",
      tasks: [
        {
          id: "t1-1",
          title: "Họp Kick-off dự án",
          description: "Tổ chức buổi họp khởi động với toàn bộ thành viên dự án và khách hàng.",
          duration: "3 ngày",
          subtasks: [
            { title: "Chuẩn bị agenda họp", description: "Gửi trước 2 ngày cho tất cả thành viên" },
            { title: "Giới thiệu đội ngũ", description: "PM, Dev Lead, Designer, BA và đại diện khách hàng" },
            { title: "Thống nhất mục tiêu SMART", description: "Specific, Measurable, Achievable, Relevant, Time-bound" },
          ],
        },
        {
          id: "t1-2",
          title: "Phỏng vấn người dùng cuối",
          description: "Thu thập nhu cầu thực tế từ các bộ phận bán hàng, kho vận, CSKH và marketing.",
          duration: "7 ngày",
          subtasks: [
            { title: "Lên lịch 12 buổi phỏng vấn", description: "Sử dụng Google Meet, ghi âm tự động" },
            { title: "Ghi chép pain points & needs", description: "Sử dụng Notion để tổ chức" },
            { title: "Tổng hợp insight bằng Affinity Mapping", description: "Phân nhóm vấn đề và cơ hội" },
            { title: "Trình bày kết quả cho khách hàng", description: "Slide deck + báo cáo chi tiết" },
          ],
        },
        {
          id: "t1-3",
          title: "Soạn tài liệu yêu cầu",
          description: "Viết BRD, SRS và tạo User Stories chi tiết cho toàn bộ hệ thống.",
          duration: "8 ngày",
          subtasks: [
            { title: "Viết Business Requirement Document (BRD)", description: "20+ trang, bao gồm business goals" },
            { title: "Vẽ User Flow & Customer Journey Map", description: "Thiết kế trên Figma" },
            { title: "Tạo hơn 120 User Stories", description: "Dưới dạng Jira tickets, có Acceptance Criteria" },
            { title: "Review và ký duyệt tài liệu", description: "Phê duyệt chính thức từ phía khách hàng" },
          ],
        },
      ],
    },
    {
      id: "s2",
      title: "Giai đoạn 2: Thiết kế hệ thống & UI/UX",
      description: "Thiết kế kiến trúc kỹ thuật, giao diện người dùng và trải nghiệm tổng thể.",
      tasks: [
        {
          id: "t2-1",
          title: "Thiết kế kiến trúc hệ thống",
          description: "Xây dựng sơ đồ kiến trúc toàn diện và lựa chọn công nghệ phù hợp.",
          duration: "10 ngày",
          subtasks: [
            { title: "Thiết kế Database Schema", description: "MySQL chính + Redis cache" },
            { title: "Định nghĩa API Contract", description: "OpenAPI/Swagger documentation" },
            { title: "Phân tách Microservices", description: "Order, Inventory, AI Engine, Auth, Notification" },
            { title: "Lựa chọn Tech Stack", description: "React + Vite, Node.js, FastAPI (Python), Redis, AWS" },
            { title: "Trình bày kiến trúc cho CTO", description: "Báo cáo + Q&A session" },
          ],
        },
        {
          id: "t2-2",
          title: "Thiết kế giao diện người dùng",
          description: "Thiết kế dashboard quản trị và ứng dụng mobile (nếu có).",
          duration: "14 ngày",
          subtasks: [
            { title: "Wireframe low-fidelity", description: "40+ màn hình chính" },
            { title: "High-fidelity mockup", description: "Figma + Design System thống nhất" },
            { title: "Xây dựng Component Library", description: "Storybook cho developer" },
            { title: "User testing với 15 người dùng", description: "Usability testing & feedback" },
            { title: "Handoff thiết kế cho dev", description: "Zeplin hoặc Figma Dev Mode" },
          ],
        },
      ],
    },
    {
      id: "s3",
      title: "Giai đoạn 3: Phát triển MVP",
      description: "Xây dựng các chức năng cốt lõi để có sản phẩm khả dụng tối thiểu.",
      tasks: [
        {
          id: "t3-1",
          title: "Setup môi trường & CI/CD",
          description: "Chuẩn bị hạ tầng phát triển và tự động hóa quy trình deploy.",
          duration: "5 ngày",
          subtasks: [
            { title: "Tạo monorepo", description: "Turborepo + GitHub repository" },
            { title: "Cấu hình Docker & Docker Compose", description: "Local, Staging, Production" },
            { title: "Thiết lập GitHub Actions", description: "Test → Build → Deploy tự động" },
            { title: "Quy định template PR & code review", description: "Conventional commits + branch protection" },
          ],
        },
        {
          id: "t3-2",
          title: "Phát triển Backend Core",
          description: "Xây dựng các service chính xử lý nghiệp vụ cốt lõi.",
          duration: "18 ngày",
          subtasks: [
            { title: "Authentication & Authorization", description: "JWT + OAuth2 (Google, Facebook)" },
            { title: "Quản lý đơn hàng", description: "Tạo, cập nhật, hủy, trạng thái đơn" },
            { title: "Đồng bộ tồn kho realtime", description: "WebSocket + Redis Pub/Sub đa kênh" },
            { title: "Tích hợp cổng thanh toán", description: "VNPay, Momo, Stripe" },
            { title: "Hệ thống thông báo", description: "Email (SES), SMS (Twilio), Push notification" },
          ],
        },
        {
          id: "t3-3",
          title: "Phát triển Frontend Dashboard",
          description: "Xây dựng giao diện quản trị cho nhân viên nội bộ.",
          duration: "20 ngày",
          subtasks: [
            { title: "Setup dự án React", description: "Vite + TypeScript + Zustand state management" },
            { title: "Xây dựng các trang chính", description: "Dashboard, Orders, Products, Customers, Reports..." },
            { title: "Biểu đồ realtime", description: "Recharts + Socket.io integration" },
            { title: "Hỗ trợ Dark Mode", description: "Toggle theme lưu localStorage" },
            { title: "Responsive design", description: "Tối ưu tablet và mobile admin" },
          ],
        },
        {
          id: "t3-4",
          title: "Xây dựng AI Recommendation Engine",
          description: "Engine gợi ý sản phẩm thông minh dựa trên hành vi khách hàng.",
          duration: "22 ngày",
          subtasks: [
            { title: "Thu thập dữ liệu hành vi", description: "View, click, add to cart, purchase" },
            { title: "Huấn luyện model Collaborative Filtering", description: "TensorFlow/Keras hoặc Surprise library" },
            { title: "Xây dựng API gợi ý", description: "FastAPI endpoint /recommend/{user_id}" },
            { title: "Framework A/B testing", description: "So sánh hiệu quả model cũ vs mới" },
            { title: "Deploy model lên production", description: "AWS SageMaker + auto scaling" },
          ],
        },
      ],
    },
    {
      id: "s4",
      title: "Giai đoạn 4: Kiểm thử & Tối ưu hóa",
      description: "Đảm bảo chất lượng, hiệu suất và bảo mật trước khi đưa vào sử dụng.",
      tasks: [
        {
          id: "t4-1",
          title: "Unit & Integration Testing",
          description: "Viết test tự động để đảm bảo độ tin cậy của code.",
          duration: "10 ngày",
          subtasks: [
            { title: "Viết hơn 400 unit tests", description: "Jest + React Testing Library" },
            { title: "Integration test API", description: "Supertest + mocked database" },
            { title: "E2E testing với Cypress", description: "20+ kịch bản quan trọng nhất" },
            { title: "Đạt code coverage > 85%", description: "Báo cáo hàng ngày trên GitHub" },
          ],
        },
        {
          id: "t4-2",
          title: "Performance & Security Audit",
          description: "Tối ưu tốc độ tải và vá lỗ hổng bảo mật.",
          duration: "7 ngày",
          subtasks: [
            { title: "Đạt Lighthouse score > 95", description: "Cả mobile và desktop" },
            { title: "Security scanning", description: "OWASP ZAP + Snyk dependency check" },
            { title: "Load testing 10.000 user đồng thời", description: "Sử dụng k6.io" },
            { title: "Fix tất cả critical & high issues", description: "Bug bash toàn team" },
          ],
        },
      ],
    },
    {
      id: "s5",
      title: "Giai đoạn 5: Triển khai & Đào tạo người dùng",
      description: "Đưa hệ thống vào vận hành thực tế và hỗ trợ người dùng cuối.",
      tasks: [
        {
          id: "t5-1",
          title: "Triển khai Production",
          description: "Deploy hệ thống lên môi trường thực tế với chiến lược an toàn.",
          duration: "5 ngày",
          subtasks: [
            { title: "Deploy backend", description: "AWS ECS Fargate + Blue/Green deployment" },
            { title: "Deploy frontend", description: "Vercel hoặc Netlify với custom domain" },
            { title: "Cấu hình monitoring & alerting", description: "Datadog + Sentry error tracking" },
            { title: "Chuyển dữ liệu từ staging", description: "Backup full + restore kiểm tra" },
            { title: "Go-live chính thức", description: "Cut-over vào khung giờ thấp điểm (2AM)" },
          ],
        },
        {
          id: "t5-2",
          title: "Đào tạo & Hỗ trợ người dùng",
          description: "Giúp nhân viên làm quen và sử dụng thành thạo hệ thống mới.",
          duration: "6 ngày",
          subtasks: [
            { title: "Quay video hướng dẫn", description: "15 video ngắn (2-5 phút)" },
            { title: "Soạn User Manual", description: "PDF + trang Notion nội bộ" },
            { title: "Tổ chức 4 buổi training", description: "2 online + 2 offline tại công ty" },
            { title: "Thiết lập Helpdesk", description: "Zendesk hoặc kênh Slack hỗ trợ" },
            { title: "Thu thập feedback tuần đầu", description: "Google Form survey + phỏng vấn nhanh" },
          ],
        },
      ],
    },
  ],
};
// ==========================================================

function StageItem({ stage }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      style={{
        background: "white",
        borderRadius: "15px",
        overflow: "hidden",
        boxShadow: "0 7.5px 22.5px rgba(0,0,0,0.08)",
        border: "1px solid #e2e8f0",
        marginBottom: "18px",
      }}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: "white",
          padding: "15px 21px",
          fontSize: "1.2rem",
          fontWeight: "bold",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          borderRadius: isOpen ? "15px 15px 0 0" : "15px",
        }}
      >
        <span>{stage.title}</span>
        <FontAwesomeIcon
          icon={isOpen ? faAngleDown : faAngleRight}
          style={{ fontSize: "21px", width: "21px", height: "21px" }}
        />
      </div>

      {isOpen && (
        <div style={{ padding: "21px", background: "#f8fafc" }}>
          <p
            style={{
              marginBottom: "18px",
              color: "#4a5568",
              lineHeight: "1.6",
              fontSize: "0.825rem",
            }}
          >
            {stage.description}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "13.5px" }}>
            {stage.tasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TaskItem({ task }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      style={{
        background: "white",
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid #e2e8f0",
        boxShadow: "0 3px 9px rgba(0,0,0,0.05)",
      }}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: "white",
          padding: "13.5px 18px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          borderRadius: isOpen ? "12px 12px 0 0" : "12px",
        }}
      >
        <span style={{ fontWeight: "600", fontSize: "0.9375rem" }}>
          {task.title}
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span
            style={{
              background: "white",
              color: "#2d3748",
              padding: "6px 13.5px",
              borderRadius: "999px",
              fontWeight: "bold",
              fontSize: "0.7125rem",
              boxShadow: "0 1.5px 4.5px rgba(0,0,0,0.1)",
            }}
          >
            {task.duration}
          </span>

          <FontAwesomeIcon
            icon={isOpen ? faAngleDown : faAngleRight}
            style={{ fontSize: "18px", width: "18px", height: "18px" }}
          />
        </div>
      </div>

      {isOpen && (
        <div
          style={{
            padding: "18px",
            background: "#f7fafc",
            borderTop: "1px solid #e2e8f0",
          }}
        >
          <p
            style={{
              marginBottom: "13.5px",
              color: "#4a5568",
              lineHeight: "1.6",
              fontSize: "0.825rem",
            }}
          >
            {task.description}
          </p>

          {task.subtasks?.length > 0 && (
            <div
              style={{
                marginLeft: "9px",
                paddingLeft: "15px",
                borderLeft: "3px solid #4299e1",
                display: "flex",
                flexDirection: "column",
                gap: "10.5px",
              }}
            >
              {task.subtasks.map((sub, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "white",
                    padding: "12px",
                    borderRadius: "9px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 1.5px 6px rgba(0,0,0,0.04)",
                  }}
                >
                  <strong
                    style={{
                      color: "#2d3748",
                      display: "block",
                      marginBottom: "4.5px",
                      fontSize: "0.75rem",
                    }}
                  >
                    {sub.title}
                  </strong>
                  <p
                    style={{
                      color: "#718096",
                      fontSize: "0.7125rem",
                      margin: 0,
                      lineHeight: "1.5",
                    }}
                  >
                    {sub.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function PlanPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "30px 15px",
      }}
    >
      <div
        style={{
          width: "886px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        {planData.stages.map((stage) => (
          <StageItem key={stage.id} stage={stage} />
        ))}
      </div>
    </div>
  );
}