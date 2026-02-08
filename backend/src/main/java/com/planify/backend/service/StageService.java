package com.planify.backend.service;

import com.planify.backend.dto.request.StageRequest;
import com.planify.backend.dto.request.StageUpdateRequest;
import com.planify.backend.dto.response.ProgressResponse;
import com.planify.backend.exception.AppException;
import com.planify.backend.exception.ErrorCode;
import com.planify.backend.model.*;
import com.planify.backend.repository.PlanRepository;
import com.planify.backend.repository.StageRepository;
import com.planify.backend.repository.TaskRepository;
import com.planify.backend.util.TimeCalculator;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PACKAGE, makeFinal = true)
@Service
public class StageService {
    private  PlanRepository planRepository;
    private StageRepository stageRepository;
    private TaskRepository taskRepository;

    public Stage addStage(StageRequest stageRequest) {
        Stage stage = new Stage();
        stage.setTitle(stageRequest.getTitle());
        stage.setDescription(stageRequest.getDescription());
        stage.setPlan_id(planRepository.findPlanById(stageRequest.getPlanId()));

        return stageRepository.save(stage);
    }

    // New: remove a stage by planId and stageId, ensuring it belongs to the plan
    @Transactional
    public void removeStageByPlanIdAndStageId(Integer planId, Integer stageId) {
        Stage stage = stageRepository.findStageByIdAndPlanId(stageId, planId);
        if (stage == null) {
            throw new AppException(ErrorCode.STAGE_NOT_FOUND);
        }

        stageRepository.delete(stage);

        Long planDuration = stageRepository.sumDurationByPlanId(planId);
        planRepository.updateDuration(planId, planDuration);
    }

    // New: get all stages for a given plan
    public List<Stage> getStagesByPlanId(Integer planId) {
        return stageRepository.findAllStage(planId);
    }

    // New: get specific stage for a given plan
    public Stage getStageByPlanIdAndStageId(Integer planId, Integer stageId) {
        return stageRepository.findStageByIdAndPlanId(stageId, planId);
    }

    // New: partial update for Stage
    public Stage updateStagePartial(Integer stageId, StageUpdateRequest request) {
        Stage stage = stageRepository.findStageById(stageId);
        if (stage == null) {
            throw new AppException(ErrorCode.STAGE_NOT_FOUND);
        }

        if (request.getTitle() != null) stage.setTitle(request.getTitle());
        if (request.getDescription() != null) stage.setDescription(request.getDescription());

        return stageRepository.save(stage);
    }

    public ProgressResponse computeProgress(Integer planId, Integer stageId) {
        Stage stage = stageRepository.findStageByIdAndPlanId(stageId, planId);
        if (stage == null) {
            throw new AppException(ErrorCode.STAGE_NOT_FOUND);
        }

        List<Task> tasks = taskRepository.findAllTask(stageId);
        if (tasks.isEmpty()) {
            return new ProgressResponse(
                    0,
                    stage.getDuration(),
                    TimeStatus.NOT_STARTED
            );
        }

        LocalDateTime startedAt = tasks.stream()
                .map(Task::getStarted_at)
                .filter(Objects::nonNull)
                .min(Comparator.naturalOrder())
                .orElse(null);
        if (startedAt == null) {
            return new ProgressResponse(
                    0,
                    stage.getDuration(),
                    TimeStatus.NOT_STARTED
            );
        }

        LocalDateTime completedAt = tasks.stream()
                .map(Task::getStarted_at)
                .filter(Objects::nonNull)
                .max(Comparator.naturalOrder())
                .orElse(null);
        if (completedAt == null) {
            return new ProgressResponse(
                    0,
                    stage.getDuration(),
                    TimeStatus.IN_PROGRESS
            );
        }

        long actualDuration = TimeCalculator.calculateActualDays(
                startedAt,
                completedAt
        );
        TimeStatus status;

        if (actualDuration > stage.getDuration()) {
            status = TimeStatus.LATE;
        } else {
            status = TimeStatus.ON_TIME;
        }
        return ProgressResponse.builder()
                .expectedDays(stage.getDuration())
                .actualDays(actualDuration)
                .status(status)
                .build();
    }

    public Stage startStage(Integer stageId) {
        Stage stage = stageRepository.findStageById(stageId);
        if (stage == null) {
            throw new AppException(ErrorCode.STAGE_NOT_FOUND);
        }
        stage.setStarted_at(LocalDateTime.now());
        return stageRepository.save(stage);
    }

    public Stage completeStage(Integer stageId) {
        Stage stage = stageRepository.findStageById(stageId);
        if (stage == null) {
            throw new AppException(ErrorCode.STAGE_NOT_FOUND);
        }
        stage.setCompleted_at(LocalDateTime.now());
        return stageRepository.save(stage);
    }
}
