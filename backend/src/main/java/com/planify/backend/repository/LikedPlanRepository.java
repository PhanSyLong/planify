package com.planify.backend.repository;

import com.planify.backend.model.LikedPlan;
import com.planify.backend.model.Plan;
import com.planify.backend.model.User;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LikedPlanRepository extends JpaRepository<@NonNull LikedPlan, @NonNull Integer> {
    boolean existsByUserIdAndPlanId(Integer userId, Integer planId);
    void deleteByUserIdAndPlanId(Integer userId, Integer planId);

    @Query("select lp.plan from LikedPlan lp where lp.user.id = :userId")
    List<Plan> findPlansByUserId(@Param("userId") Integer userId);

    @Query("select lp.user from LikedPlan lp where lp.plan.id = :planId")
    List<User> findUsersByPlanId(@Param("planId") Integer planId);
}
