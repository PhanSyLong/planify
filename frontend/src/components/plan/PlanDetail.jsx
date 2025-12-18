import StageItem from './StageItem';

const planData = [
  {
    id: 's1',
    title: 'Stage 1',
    description: 'Lập kế hoạch & nghiên cứu',
    tasks: [
      {
        id: 't1',
        title: 'Task 1',
        description: 'Xác định yêu cầu dự án',
        duration: '5 ngày',
        subtasks: [
          { title: 'Subtask 1', description: 'Thu thập ý kiến từ các bên liên quan' },
          { title: 'Subtask 2', description: 'Viết tài liệu yêu cầu' },
        ],
      },
    ],
  },
  {
    id: 's2',
    title: 'Stage 2',
    description: 'Phát triển sản phẩm',
    tasks: [
      {
        id: 't2',
        title: 'Task 2',
        description: 'Xây dựng chức năng chính',
        duration: '12 ngày',
        subtasks: [
          { title: 'Subtask 1', description: 'Thiết kế database' },
          { title: 'Subtask 2', description: 'Viết API' },
          { title: 'Subtask 3', description: 'Làm giao diện người dùng' },
        ],
      },
    ],
  },
];

export default function PlanDetail() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {planData.map(stage => (
        <StageItem key={stage.id} stage={stage} />
      ))}
    </div>
  );
}