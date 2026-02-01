package com.planify.backend.repository;

import com.planify.backend.model.TagPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TagPlanRepository extends JpaRepository<TagPlan, Integer> {

    List<TagPlan> findByPlanId(Integer planId);

    void deleteByPlanId(Integer planId);

    void deleteByPlanIdAndTagId(Integer planId, Integer tagId);
}
