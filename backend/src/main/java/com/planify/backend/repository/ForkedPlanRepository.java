package com.planify.backend.repository;

import com.planify.backend.model.ForkedPlan;
import com.planify.backend.model.Plan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ForkedPlanRepository extends JpaRepository<ForkedPlan, Integer> {
    void deleteByAdopterIdAndAdoptedPlanId(Integer adopterId, Integer planId);

    @Query("SELECT fp.originalPlan FROM ForkedPlan fp WHERE fp.adoptedPlan.id = :adoptedPlanId")
    Plan findOriginalPlanByAdoptedPlanId(Integer adoptedPlanId);
    @Query("SELECT fp.adoptedPlan FROM ForkedPlan fp WHERE fp.originalPlan.id = :originalPlanId")
    List<Plan> findPlanForksByOriginalPlanId(Integer originalPlanId);
}
