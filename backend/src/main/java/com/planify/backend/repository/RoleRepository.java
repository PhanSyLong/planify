package com.planify.backend.repository;

import com.planify.backend.entity.Role;
import com.planify.backend.entity.Role.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;


public interface RoleRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findByName(RoleName name);
}
