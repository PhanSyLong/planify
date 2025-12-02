package com.planify.backend.repository;

import com.planify.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    boolean existsByUsername(String username);

    Optional<User> findByUsername(String username);
    
    @Modifying
    @Query("UPDATE User u SET u.created_by = NULL WHERE u.created_by = :userId")
    void clearCreatedByReferences(@Param("userId") Integer userId);
    
    @Modifying
    @Query("UPDATE User u SET u.updated_by = NULL WHERE u.updated_by = :userId")
    void clearUpdatedByReferences(@Param("userId") Integer userId);
}
