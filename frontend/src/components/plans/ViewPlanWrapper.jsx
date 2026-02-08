import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useHydratedPlan } from '../../queries/useHydratedPlan';
import ViewMyPlan from './ViewMyPlan';
import ViewPlan from './ViewPlan';

/**
 * Smart wrapper component that decides whether to show ViewMyPlan or ViewPlan
 * based on plan ownership
 */
const ViewPlanWrapper = () => {
  const { id } = useParams();
  const { data: fullPlan, isLoading } = useHydratedPlan(id);

  // Get current user ID
  const currentUserId = localStorage.getItem("userId");

  // Determine if current user owns this plan
  const isOwnedByCurrentUser = useMemo(() => {
    if (!fullPlan || !currentUserId) return false;
    return String(fullPlan.ownerId) === currentUserId;
  }, [fullPlan, currentUserId]);

  // Show loading state while plans are being fetched
  if (isLoading) {
    return (
      <div className="viewplan-loading">
        <div className="spinner" role="status" aria-label="Loading"></div>
        <p>Loading plan...</p>
      </div>
    );
  }

  // Render appropriate component based on ownership
  if (isOwnedByCurrentUser) {
    return <ViewMyPlan />;
  } else {
    return <ViewPlan />;
  }
};

export default ViewPlanWrapper;
