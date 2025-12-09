package com.planify.backend.repository;

import com.planify.backend.model.Plan;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlanRepository extends JpaRepository<@NonNull Plan, @NonNull Integer> {
    @Query("SELECT p FROM Plan p WHERE p.id = :planId")
    Plan findPlanById(@Param("planId") Integer planId);

    @Query("SELECT p FROM Plan p WHERE p.owner.id = :ownerId")
    List<Plan> findPlanByUserId(@Param("ownerId") Integer ownerId);
}
