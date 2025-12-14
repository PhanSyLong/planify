package com.planify.backend.repository;

import com.planify.backend.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRoleRepository extends JpaRepository<UserRole , Integer> {

}