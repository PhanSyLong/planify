package com.planify.backend.repository;

import com.planify.backend.model.ForkedPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ForkedPlanRepository extends JpaRepository<ForkedPlan, Integer> {
    void deleteByAdoptedUserIdAndAdoptedPlanId(Integer adopterId, Integer planId);
}
