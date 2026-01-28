package com.planify.backend.repository;

import com.planify.backend.model.Subtask;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SubtaskRepository extends JpaRepository<@NonNull Subtask, @NonNull Integer> {
    @Query("select st from Subtask st where st.task_id.id = :taskId")
    List<Subtask> findAllSubtask(@Param("taskId") @NonNull Integer taskId);

    @Query("select st from Subtask st where st.id = :subtaskId and st.task_id.id = :taskId")
    Subtask findSubtaskByIdAndTaskId(@Param("subtaskId") @NonNull Integer subtaskId, @Param("taskId") @NonNull Integer taskId);

    @Query("SELECT st from Subtask st WHERE st.task_id.stage_id.plan_id.id = :planId")
    List<Subtask> findAllSubtaskByPlanId(@Param("planId") @NonNull Integer planId);

    @Query("select coalesce(sum(st.duration), 0) from Subtask st where st.task_id.id = :taskId")
    Integer sumDurationByTaskId(@Param("taskId") @NonNull Integer taskId);

    // New: find incomplete subtasks (not completed) for an owner that have a scheduled_date, ordered by scheduled_date asc
    @Query("select st from Subtask st where st.task_id.stage_id.plan_id.owner.id = :ownerId and st.status <> 'completed' and st.scheduledDate is not null order by st.scheduledDate asc")
    List<Subtask> findIncompleteScheduledByOwnerOrdered(@Param("ownerId") @NonNull Integer ownerId);
}
