// src/pages/PlanPage.jsx
//fake add plan for demo
import { planData } from '../data/planData';
import PlanHeader from '../components/plan/PlanHeader';
import StageItem from '../components/plan/StageItem';

export default function PlanPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "20px" }}>
      <PlanHeader
        description={planData.description}
        tags={planData.tags}
        duration={planData.duration}
      />
      <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
        {planData.stages.map(stage => (
          <StageItem key={stage.id} stage={stage} />
        ))}
      </div>
    </div>
  );
}