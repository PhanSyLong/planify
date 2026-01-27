package com.planify.backend.repository;

import com.planify.backend.model.Stage;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;


@Repository
public interface StageRepository extends JpaRepository<@NonNull Stage, @NonNull Integer> {
    Stage findStageById(@NonNull Integer id);

    // Find all stages that belong to a plan (by plan id) - return list of stages
    @Query("select s from Stage s where s.plan_id.id = :planId")
    List<Stage> findAllStage(@Param("planId") @NonNull Integer planId);

    // Find a stage by id and ensure it belongs to the given plan id
    @Query("select s from Stage s where s.id = :stageId and s.plan_id.id = :planId")
    Stage findStageByIdAndPlanId(@Param("stageId") @NonNull Integer stageId, @Param("planId") @NonNull Integer planId);

    // Sum durations of stages that belong to a plan (expected time)
    @Query("select coalesce(sum(s.duration), 0) from Stage s where s.plan_id.id = :planId")
    Long sumDurationByPlanId(@Param("planId") @NonNull Integer planId);

    @Modifying
    @Query(value = "UPDATE stage SET duration = :duration WHERE id = :stageId", nativeQuery = true)
    void updateDuration(@Param("stageId") Integer stageId, @Param("duration") Integer duration);

}
