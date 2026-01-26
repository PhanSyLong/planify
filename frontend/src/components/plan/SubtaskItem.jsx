// components/SubtaskItem.jsx
export default function SubtaskItem({ subtask }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition">
      <h4 className="font-semibold text-gray-800">{subtask.title}</h4>
      <p className="text-sm text-gray-600 mt-1">{subtask.description}</p>
    </div>
  );
}