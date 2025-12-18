package com.planify.backend.service;

import com.planify.backend.dto.request.StageRequest;
import com.planify.backend.model.TimeStatus;
import com.planify.backend.dto.response.TimingResponse;
import com.planify.backend.exception.AppException;
import com.planify.backend.exception.ErrorCode;
import com.planify.backend.model.Stage;
import com.planify.backend.repository.PlanRepository;
import com.planify.backend.repository.StageRepository;
import com.planify.backend.repository.SubtaskRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PACKAGE, makeFinal = true)
@Service
public class StageService {
    private  PlanRepository planRepository;
    private StageRepository stageRepository;
    private SubtaskRepository subtaskRepository;

    public Stage addStage(StageRequest stageRequest) {
        Stage stage = new Stage();
        stage.setTitle(stageRequest.getTitle());
        stage.setDescription(stageRequest.getDescription());
//        stage.setDuration(stageRequest.getDuration());
        stage.setPlan_id(planRepository.findPlanById(stageRequest.getPlanId()));

        return stageRepository.save(stage);
    }

    // New: remove a stage by planId and stageId, ensuring it belongs to the plan
    public void removeStageByPlanIdAndStageId(Integer planId, Integer stageId) {
        Stage stage = stageRepository.findStageByIdAndPlanId(stageId, planId);
        if (stage == null) {
            throw new AppException(ErrorCode.STAGE_NOT_FOUND);
        }

        stageRepository.delete(stage);
    }

    // New: get all stages for a given plan
    public List<Stage> getStagesByPlanId(Integer planId) {
        return stageRepository.findAllStage(planId);
    }

    // New: get specific stage for a given plan
    public Stage getStageByPlanIdAndStageId(Integer planId, Integer stageId) {
        return stageRepository.findStageByIdAndPlanId(stageId, planId);
    }

    // New: compute timing status for a stage
    public TimingResponse computeTimeStatus(Integer planId, Integer stageId) {
        Stage stage = stageRepository.findStageByIdAndPlanId(stageId, planId);
        if (stage == null) {
            throw new AppException(ErrorCode.STAGE_NOT_FOUND);
        }

        Integer expected = stage.getDuration();
        Integer actual = subtaskRepository.sumCompletedDurationByStageId(stageId);

        TimeStatus status;
        if (actual < expected) status = com.planify.backend.model.TimeStatus.EARLY;
        else if (actual > expected) status = com.planify.backend.model.TimeStatus.LATE;
        else status = com.planify.backend.model.TimeStatus.ON_TIME;

        return TimingResponse.builder()
                .planId(planId)
                .expectedTime(expected)
                .actualTime(actual)
                .status(status)
                .build();
    }

    // New: partial update for Stage
    public Stage updateStagePartial(Integer stageId, com.planify.backend.dto.request.StageUpdateRequest request) {
        Stage stage = stageRepository.findStageById(stageId);
        if (stage == null) {
            throw new AppException(ErrorCode.STAGE_NOT_FOUND);
        }

        if (request.getTitle() != null) stage.setTitle(request.getTitle());
        if (request.getDescription() != null) stage.setDescription(request.getDescription());

        return stageRepository.save(stage);
    }
}
