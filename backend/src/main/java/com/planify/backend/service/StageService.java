package com.planify.backend.service;

import com.planify.backend.dto.request.StageRequest;
import com.planify.backend.model.Stage;
import com.planify.backend.repository.PlanRepository;
import com.planify.backend.repository.StageRepository;
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

    public Stage addStage(StageRequest stageRequest) {
        Stage stage = new Stage();
        stage.setTitle(stageRequest.getTitle());
        stage.setDescription(stageRequest.getDescription());
        stage.setDuration(stageRequest.getDuration());
        stage.setPlan_id(planRepository.findPlanById(stageRequest.getPlanId()));

        return stageRepository.save(stage);
    }

    public void removeStageById(Integer stageId) {
        stageRepository.deleteById(stageId);
    }

    public Stage getStageById(Integer stageId) {
        return stageRepository.findStageById(stageId);
    }

    public List<Stage> getAllStages() {
        return stageRepository.findAll();
    }
}
