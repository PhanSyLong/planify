// src/data/planData.js
export const planData = {
  title: "Hệ thống quản lý bán hàng đa kênh tích hợp AI",
  description:
    "Xây dựng hệ thống quản lý bán hàng đa kênh tích hợp AI, giúp tự động hóa quy trình từ đơn hàng đến kho vận, đồng bộ tồn kho realtime, phân tích hành vi khách hàng và đề xuất sản phẩm thông minh.",
  tags: ["In Progress", "E-commerce", "AI & Automation"],
  duration: 45,

  stages: [
    {
      id: "s1",
      title: "Stage 1",
      description: "Khởi tạo dự án & Thu thập yêu cầu",
      tasks: [
        {
          id: "t1-1",
          title: "Task 1 - Kick-off meeting",
          description: "Tổ chức buổi họp khởi động dự án với toàn bộ bên liên quan",
          duration: "3 ngày",
          subtasks: [
            { title: "Chuẩn bị agenda", description: "Gửi trước 2 ngày" },
            { title: "Giới thiệu team", description: "Dev, PM, Designer, Stakeholder" },
            { title: "Định nghĩa mục tiêu SMART", description: "Cụ thể, đo lường được" },
          ],
        },
        {
          id: "t1-2",
          title: "Task 2 - Phỏng vấn người dùng",
          description: "Phỏng vấn các bộ phận: bán hàng, kho, CSKH, marketing",
          duration: "7 ngày",
          subtasks: [
            { title: "Lên lịch 12 buổi phỏng vấn", description: "Google Meet + ghi âm" },
            { title: "Ghi chép pain points", description: "Dùng Notion" },
            { title: "Tổng hợp insight", description: "Affinity mapping" },
            { title: "Trình bày kết quả cho khách hàng", description: "Slide deck" },
          ],
        },
        {
          id: "t1-3",
          title: "Task 3 - Viết tài liệu yêu cầu",
          description: "Soạn BRD, SRS và User Stories",
          duration: "8 ngày",
          subtasks: [
            { title: "Viết Business Requirement Document", description: "20+ trang" },
            { title: "Vẽ User Flow & Customer Journey", description: "Figma" },
            { title: "Tạo 120+ User Stories", description: "Jira tickets" },
            { title: "Review & ký duyệt", description: "Từ khách hàng" },
          ],
        },
      ],
    },

    {
      id: "s2",
      title: "Stage 2",
      description: "Thiết kế hệ thống & UI/UX",
      tasks: [
        {
          id: "t2-1",
          title: "Task 1 - Thiết kế kiến trúc hệ thống",
          description: "Xây dựng sơ đồ kiến trúc toàn hệ thống",
          duration: "10 ngày",
          subtasks: [
            { title: "Database schema design", description: "MySQL + Redis" },
            { title: "API contract (OpenAPI)", description: "Swagger docs" },
            { title: "Microservices breakdown", description: "Order, Inventory, AI, Auth" },
            { title: "Chọn tech stack", description: "React, Node.js, Python FastAPI" },
            { title: "Báo cáo kiến trúc", description: "Trình bày cho CTO" },
          ],
        },
        {
          id: "t2-2",
          title: "Task 2 - Thiết kế giao diện",
          description: "Thiết kế dashboard quản trị và mobile app",
          duration: "14 ngày",
          subtasks: [
            { title: "Wireframe low-fi", description: "Tất cả 40+ màn hình" },
            { title: "High-fidelity mockup", description: "Figma + Design System" },
            { title: "Tạo component library", description: "Storybook" },
            { title: "User testing với 15 người", description: "Usability test" },
            { title: "Final design handoff", description: "Zeplin/Figma Dev Mode" },
          ],
        },
      ],
    },

    {
      id: "s3",
      title: "Stage 3",
      description: "Phát triển MVP",
      tasks: [
        {
          id: "t3-1",
          title: "Task 1 - Setup dự án & CI/CD",
          description: "Chuẩn bị môi trường phát triển",
          duration: "5 ngày",
          subtasks: [
            { title: "Tạo repo monorepo", description: "Turborepo + GitHub" },
            { title: "Setup Docker + Docker Compose", description: "Dev + Staging + Prod" },
            { title: "Cấu hình GitHub Actions", description: "Test + Build + Deploy" },
            { title: "Tạo template PR & code review", description: "Conventional commits" },
          ],
        },
        {
          id: "t3-2",
          title: "Task 2 - Backend core",
          description: "Xây dựng các service chính",
          duration: "18 ngày",
          subtasks: [
            { title: "Auth service (JWT + OAuth)", description: "Google, Facebook" },
            { title: "Order management", description: "Tạo, cập nhật, hủy đơn" },
            { title: "Inventory sync realtime", description: "WebSocket + Redis Pub/Sub" },
            { title: "Payment gateway integration", description: "VNPay, Momo, Stripe" },
            { title: "Notification system", description: "Email + SMS + Push" },
          ],
        },
        {
          id: "t3-3",
          title: "Task 3 - Frontend dashboard",
          description: "Xây dựng giao diện quản trị",
          duration: "20 ngày",
          subtasks: [
            { title: "Setup React + Vite + TypeScript", description: "Với Zustand" },
            { title: "Xây dựng 25+ trang chính", description: "Dashboard, Orders, Products..." },
            { title: "Realtime charts", description: "Recharts + Socket.io" },
            { title: "Dark mode toggle", description: "Tailwind class" },
            { title: "Responsive cho tablet", description: "Breakpoint 768px" },
          ],
        },
        {
          id: "t3-4",
          title: "Task 4 - AI Recommendation Engine",
          description: "Xây dựng engine gợi ý sản phẩm",
          duration: "22 ngày",
          subtasks: [
            { title: "Thu thập dữ liệu hành vi", description: "Click, view, purchase" },
            { title: "Xây model Collaborative Filtering", description: "Python + TensorFlow" },
            { title: "API FastAPI", description: "Endpoint /recommend" },
            { title: "A/B testing framework", description: "So sánh model cũ vs mới" },
            { title: "Deploy lên AWS SageMaker", description: "Auto scaling" },
          ],
        },
      ],
    },

    {
      id: "s4",
      title: "Stage 4",
      description: "Kiểm thử & Tối ưu",
      tasks: [
        {
          id: "t4-1",
          title: "Task 1 - Unit & Integration Test",
          description: "Đảm bảo chất lượng code",
          duration: "10 ngày",
          subtasks: [
            { title: "Viết 400+ unit test", description: "Jest + React Testing Library" },
            { title: "Integration test API", description: "Supertest" },
            { title: "E2E test với Cypress", description: "20+ kịch bản quan trọng" },
            { title: "Code coverage > 85%", description: "Báo cáo hàng ngày" },
          ],
        },
        {
          id: "t4-2",
          title: "Task 2 - Performance & Security Audit",
          description: "Tối ưu tốc độ và bảo mật",
          duration: "7 ngày",
          subtasks: [
            { title: "Lighthouse score > 95", description: "Mobile & Desktop" },
            { title: "Security scan", description: "OWASP ZAP + Snyk" },
            { title: "Load test 10k user đồng thời", description: "k6.io" },
            { title: "Fix tất cả critical issues", description: "Bug bash team" },
          ],
        },
      ],
    },

    {
      id: "s5",
      title: "Stage 5",
      description: "Triển khai & Đào tạo",
      tasks: [
        {
          id: "t5-1",
          title: "Task 1 - Triển khai Production",
          description: "Đưa hệ thống lên môi trường thật",
          duration: "5 ngày",
          subtasks: [
            { title: "Deploy backend lên AWS ECS", description: "Blue/Green deployment" },
            { title: "Frontend lên Vercel/Netlify", description: "Custom domain" },
            { title: "Cấu hình monitoring", description: "Datadog + Sentry" },
            { title: "Chuyển data từ staging", description: "Backup + restore" },
            { title: "Go-live chính thức", description: "Cut-over lúc 2AM" },
          ],
        },
        {
          id: "t5-2",
          title: "Task 2 - Đào tạo người dùng",
          description: "Hướng dẫn nhân viên sử dụng hệ thống",
          duration: "6 ngày",
          subtasks: [
            { title: "Tạo video hướng dẫn", description: "15 video ngắn" },
            { title: "Tài liệu user manual", description: "PDF + Notion" },
            { title: "Tổ chức 4 buổi training", description: "Online + offline" },
            { title: "Setup helpdesk", description: "Zendesk" },
            { title: "Thu thập feedback tuần đầu", description: "Survey" },
          ],
        },
      ],
    },
  ],
};