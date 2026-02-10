package com.planify.backend.repository;

import com.planify.backend.model.Subtask;
import jakarta.persistence.LockModeType;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
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
    @Query("select st from Subtask st where st.task_id.stage_id.plan_id.owner.id = :ownerId and st.status = 'incompleted' and st.scheduledDate is not null order by st.scheduledDate asc")
    List<Subtask> findIncompleteScheduledByOwnerOrdered(@Param("ownerId") @NonNull Integer ownerId);
    //
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
    SELECT st FROM Subtask st
    JOIN FETCH st.task_id t
    JOIN FETCH t.stage_id s
    JOIN FETCH s.plan_id p
    JOIN FETCH p.owner u
    WHERE st.scheduledDate > :from
      AND st.scheduledDate <= :to
      AND st.scheduledSent = false
""")
    List<Subtask> findSubTasksToRemind(
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to
    );

}
