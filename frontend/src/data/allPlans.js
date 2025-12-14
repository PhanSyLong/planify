// src/data/allPlans.js

const allPlans = [
  {
    id: 1,
    title: "Ôn thi Đại học khối A1",
    duration: "90 ngày",
    info: "Kế hoạch chi tiết Toán - Lý - Anh",
    name: "Ôn thi Đại học khối A1",
    authorId: "user123",
    isPublic: true,
    likes: 245,
    description: "Kế hoạch ôn tập toàn diện cho kỳ thi THPT Quốc gia khối A1. Bao gồm lý thuyết, bài tập nâng cao và đề thi thử.",
    stages: [
      {
        name: "Giai đoạn 1: Nền tảng",
        duration: "30 ngày",
        tasks: ["Ôn chương trình lớp 11", "Làm bài tập cơ bản Toán - Lý - Anh", "Kiểm tra tuần"]
      },
      {
        name: "Giai đoạn 2: Nâng cao",
        duration: "40 ngày",
        tasks: ["Ôn chuyên đề khó", "Giải đề thi thử các năm trước", "Phân tích lỗi sai"]
      },
      {
        name: "Giai đoạn 3: Tổng ôn",
        duration: "20 ngày",
        tasks: ["Làm full đề thi thử", "Ôn lại kiến thức yếu", "Giữ sức khỏe và tinh thần"]
      }
    ]
  },
  {
    id: 2,
    title: "Học tiếng Anh giao tiếp từ con số 0",
    duration: "30 ngày",
    info: "Nói chuyện tự tin trong đời sống hàng ngày",
    authorId: "user456",
    isPublic: true,
    likes: 412,
    description: "Chương trình luyện nói thực tế với 500 từ vựng thông dụng nhất và các mẫu câu giao tiếp cơ bản.",
    stages: [
      {
        name: "Tuần 1: Phát âm & Từ vựng cơ bản",
        duration: "7 ngày",
        tasks: ["Học bảng IPA", "500 từ vựng thiết yếu", "Luyện phát âm hàng ngày"]
      },
      {
        name: "Tuần 2-4: Luyện nói theo chủ đề",
        duration: "21 ngày",
        tasks: ["Chào hỏi - Giới thiệu bản thân", "Ăn uống - Đi chợ", "Du lịch - Hỏi đường", "Công việc - Phỏng vấn"]
      }
    ]
  },
  {
    id: 3,
    title: "Tập gym tăng cơ cho người mới",
    duration: "12 tuần",
    info: "Fullbody 3 buổi/tuần",
    authorId: "user123",
    isPublic: true,
    likes: 578,
    description: "Kế hoạch tập luyện dành cho người mới bắt đầu, tập trung tăng cơ giảm mỡ với lịch dễ theo dõi.",
    stages: [
      {
        name: "Tuần 1-4: Làm quen & Xây nền",
        tasks: ["Học kỹ thuật cơ bản", "Tập fullbody 3 buổi/tuần", "Tăng dần trọng lượng tạ"]
      },
      {
        name: "Tuần 5-12: Tăng cường độ",
        tasks: ["Thêm sets/reps", "Theo dõi dinh dưỡng", "Nghỉ ngơi phục hồi"]
      }
    ]
  },
  {
    id: 4,
    title: "Học lập trình React từ cơ bản đến nâng cao",
    duration: "60 ngày",
    info: "Xây dựng dự án thực tế",
    authorId: "user789",
    isPublic: true,
    likes: 892,
    description: "Hành trình từ zero đến có thể làm freelance React. Bao gồm hooks, router, redux, API...",
    stages: [
      { name: "Tuần 1-2: JSX & Components", tasks: ["Setup môi trường", "State & Props", "Project nhỏ"] },
      { name: "Tuần 3-6: Hooks & Advanced", tasks: ["useEffect, useContext", "React Router", "Custom hooks"] },
      { name: "Tuần 7-8: Dự án cuối khóa", tasks: ["Xây app todo + auth", "Deploy lên Vercel"] }
    ]
  },
  {
    id: 5,
    title: "Giảm cân khoa học trong 8 tuần",
    duration: "56 ngày",
    info: "Kết hợp ăn uống + tập luyện",
    authorId: "user234",
    isPublic: true,
    likes: 334,
    description: "Kế hoạch giảm 5-8kg an toàn, bền vững với thực đơn mẫu và bài tập tại nhà."
  },
  {
    id: 6,
    title: "Luyện thi IELTS 7.0+",
    duration: "120 ngày",
    info: "Chiến lược từng band",
    authorId: "user456",
    isPublic: true,
    likes: 667,
    description: "Lộ trình chi tiết cho cả 4 kỹ năng Listening, Reading, Writing, Speaking."
  },
  {
    id: 7,
    title: "Học vẽ digital cơ bản",
    duration: "45 ngày",
    info: "Từ nét cơ bản đến tranh hoàn chỉnh",
    authorId: "user567",
    isPublic: true,
    likes: 289,
    description: "Dành cho người mới bắt đầu với tablet hoặc chuột máy tính."
  },
  {
    id: 8,
    title: "Quản lý tài chính cá nhân hiệu quả",
    duration: "30 ngày",
    info: "Tiết kiệm & đầu tư thông minh",
    authorId: "user123",
    isPublic: true,
    likes: 156,
    description: "Thói quen chi tiêu, quỹ khẩn cấp, đầu tư cơ bản cho người trẻ."
  },
  {
    id: 9,
    title: "Ôn thi THPT Quốc gia môn Văn",
    duration: "60 ngày",
    info: "Phân tích tác phẩm trọng tâm",
    authorId: "user890",
    isPublic: true,
    likes: 201,
    description: "Tóm tắt tác phẩm, phương pháp làm bài nghị luận xã hội và văn học."
  },
  {
    id: 10,
    title: "Học guitar cơ bản trong 30 ngày",
    duration: "30 ngày",
    info: "Chơi được 10 bài hát phổ biến",
    authorId: "user234",
    isPublic: true,
    likes: 423,
    description: "Hợp âm cơ bản, quạt chả, đệm hát."
  },
  {
    id: 11,
    title: "Xây kênh YouTube từ 0 đến 1K subs",
    duration: "90 ngày",
    info: "Chiến lược nội dung + SEO",
    authorId: "user789",
    isPublic: true,
    likes: 512,
    description: "Lập kế hoạch nội dung, tối ưu video, tăng tương tác."
  },
  {
    id: 12,
    title: "Làm bánh cơ bản tại nhà",
    duration: "14 ngày",
    info: "10 công thức dễ làm",
    authorId: "user567",
    isPublic: true,
    likes: 378,
    description: "Bánh quy, cupcake, bánh mì không cần lò chuyên dụng."
  },
  {
    id: 13,
    title: "Luyện thi vào lớp 10 môn Toán",
    duration: "75 ngày",
    info: "Chuyên đề trọng tâm",
    authorId: "user890",
    isPublic: true,
    likes: 298,
    description: "Ôn tập hình học, đại số, bài toán thực tế thường gặp."
  },
  {
    id: 14,
    title: "Thiền & Mindfulness hàng ngày",
    duration: "21 ngày",
    info: "Xây dựng thói quen giảm stress",
    authorId: "user123",
    isPublic: true,
    likes: 267,
    description: "Bài thiền hướng dẫn, kỹ thuật thở, nhật ký cảm xúc."
  },
  {
    id: 15,
    title: "Học Python cho người mới",
    duration: "45 ngày",
    info: "Từ cơ bản đến dự án nhỏ",
    authorId: "user123",
    isPublic: true,
    likes: 734,
    description: "Biến, hàm, list, dictionary, OOP cơ bản và mini project."
  }
];

export default allPlans;