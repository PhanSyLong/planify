package com.planify.backend.repository;

import com.planify.backend.model.Stage;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StageRepository extends JpaRepository<@NonNull Stage, @NonNull Integer> {
    Stage findStageById(@NonNull Integer id);
}
