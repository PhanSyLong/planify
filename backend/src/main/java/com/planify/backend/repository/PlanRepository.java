package com.planify.backend.repository;

import com.planify.backend.model.Plan;
import jakarta.persistence.LockModeType;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Lock;

import org.springframework.data.jpa.repository.Modifying;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.time.LocalDateTime;

@Repository
public interface PlanRepository extends JpaRepository<@NonNull Plan, @NonNull Integer> {

    @Query("SELECT p FROM Plan p WHERE p.id = :planId")
    Plan findPlanById(@Param("planId") Integer planId);

    @Query("SELECT p FROM Plan p WHERE p.owner.id = :ownerId")
    List<Plan> findPlanByUserId(@Param("ownerId") Integer ownerId);

    @Query("SELECT p FROM Plan p WHERE p.title = :planTitle")
    Plan findPlanByName(@Param("planTitle") String planTitle);

    /** Reminder Plan Function
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Plan p " +
            "JOIN FETCH p.owner u " +
            "WHERE p.reminderAt <= :now " +
            "AND p.reminderSent = FALSE")
    List<Plan> findRemindersPlanWithDetails(@Param("now") LocalDateTime now);

    /** Expired Plan Function
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Plan p " +
            "JOIN FETCH p.owner u " +
            "WHERE p.expiredAt <= :now " +
            "AND p.expiredSent = FALSE")
    List<Plan> findDuePlansWithDetails(@Param("now") LocalDateTime now);

    @Query("""
    SELECT p FROM Plan p
    WHERE LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%'))
""")
    List<Plan> searchByTitle(@Param("query") String query);

    @Query("""
    SELECT DISTINCT p FROM Plan p
    JOIN p.tagPlans tp
    JOIN tp.tag t
    WHERE t.tagName IN :tagNames AND p.visibility = 'public'
    GROUP BY p.id
    HAVING COUNT(DISTINCT t.tagName) = :tagCount
""")
    List<Plan> findByTagNames(
            @Param("tagNames") List<String> tagNames,
            @Param("tagCount") long tagCount
    );

    @Query("""
    SELECT DISTINCT p FROM Plan p
    JOIN p.tagPlans tp
    JOIN tp.tag t
    WHERE LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%'))
    AND t.tagName IN :tagNames
    GROUP BY p.id
    HAVING COUNT(DISTINCT t.tagName) = :tagCount
""")
    List<Plan> searchByQueryAndTags(
            @Param("query") String query,
            @Param("tagNames") List<String> tagNames,
            @Param("tagCount") long tagCount
    );



    @Modifying
    @Query(value = "UPDATE plan SET duration = :duration WHERE id = :planId", nativeQuery = true)
    void updateDuration(@Param("planId") Integer planId, @Param("duration") Long duration);

}
