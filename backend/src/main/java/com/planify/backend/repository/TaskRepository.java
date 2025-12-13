package com.planify.backend.repository;

import com.planify.backend.model.Task;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TaskRepository extends JpaRepository<@NonNull Task, @NonNull Integer> {
    Task findTaskById(@NonNull Integer id);

    @Query("select t from Task t where t.stage_id.id = :stageId")
    List<Task> findAllTask(@Param("stageId") @NonNull Integer stageId);

    @Query("select t from Task t where t.id = :taskId and t.stage_id.id = :stageId")
    Task findTaskByIdAndStageId(@Param("taskId") @NonNull Integer taskId, @Param("stageId") @NonNull Integer stageId);
}
