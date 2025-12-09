package com.planify.backend.repository;

import com.planify.backend.model.Subtask;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubtaskRepository extends JpaRepository<@NonNull Subtask, @NonNull Integer> {

}
