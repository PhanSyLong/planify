package com.planify.backend.repository;

import com.planify.backend.model.Subtask;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SubtaskRepository extends JpaRepository<@NonNull Subtask, @NonNull Integer> {
    @Query("select st.id from Subtask st where st.task_id.id = :taskId")
    List<Integer> findAllSubtask(@Param("taskId") @NonNull Integer taskId);

    @Query("select st from Subtask st where st.id = :subtaskId and st.task_id.id = :taskId")
    Subtask findSubtaskById(@Param("subtaskId") @NonNull Integer subtaskId, @Param("taskId") @NonNull Integer taskId);

    // Sum durations of completed subtasks for a plan (walk through relationships task->stage->plan)
    @Query("select coalesce(sum(st.duration), 0) from Subtask st where st.task_id.stage_id.plan_id.id = :planId and st.status = 'completed'")
    Integer sumCompletedDurationByPlanId(@Param("planId") @NonNull Integer planId);

    // Sum durations of completed subtasks for a stage
    @Query("select coalesce(sum(st.duration), 0) from Subtask st where st.task_id.stage_id.id = :stageId and st.status = 'completed'")
    Integer sumCompletedDurationByStageId(@Param("stageId") @NonNull Integer stageId);

    // Sum durations of completed subtasks for a task
    @Query("select coalesce(sum(st.duration), 0) from Subtask st where st.task_id.id = :taskId and st.status = 'completed'")
    Integer sumCompletedDurationByTaskId(@Param("taskId") @NonNull Integer taskId);
}
