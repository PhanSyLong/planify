package com.planify.backend.repository;

import com.planify.backend.model.Task;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<@NonNull Task, @NonNull Integer> {

}
