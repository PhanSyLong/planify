package com.planify.backend.repository;

import com.planify.backend.dto.response.DailyPerformanceResponse;
import com.planify.backend.model.DailyPerformance;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DailyPerformanceRepository
        extends JpaRepository<DailyPerformance, Integer> {

    @Query("""
               select dp from DailyPerformance dp
               join fetch dp.user
               left join fetch dp.plan
               where dp.date between :start and :end
            """)
    List<DailyPerformance> findByDateBetweenWithUser(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    @Query("""
                SELECT new com.planify.backend.dto.response.DailyPerformanceResponse(
                    COALESCE(SUM(d.subtasksCompleted), 0),
                    COALESCE(SUM(d.subtasksIncompleted), 0),
                    COALESCE(SUM(d.subtasksCancelled), 0)
                )
                FROM DailyPerformance d
                WHERE d.user.id = :userId
                  AND d.date BETWEEN :start AND :end
            """)
    DailyPerformanceResponse getTodaySummary(
            @Param("userId") Long userId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    // Find today's record for a specific user and plan
    @Query("""
                SELECT dp FROM DailyPerformance dp
                WHERE dp.user.id = :userId
                  AND dp.plan.id = :planId
                  AND dp.date BETWEEN :start AND :end
            """)
    Optional<DailyPerformance> findByUserIdAndPlanIdAndDateBetween(
            @Param("userId") Long userId,
            @Param("planId") Integer planId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    // Get records for a date range grouped by day (for WeeklyChart)
    @Query("""
                SELECT new com.planify.backend.dto.response.DailyPerformanceResponse(
                    CAST(d.date AS LocalDate),
                    COALESCE(SUM(d.subtasksCompleted), 0),
                    COALESCE(SUM(d.subtasksIncompleted), 0),
                    COALESCE(SUM(d.subtasksCancelled), 0)
                )
                FROM DailyPerformance d
                WHERE d.user.id = :userId
                  AND d.date BETWEEN :start AND :end
                GROUP BY CAST(d.date AS LocalDate)
                ORDER BY CAST(d.date AS LocalDate)
            """)
    List<DailyPerformanceResponse> getWeeklySummary(
            @Param("userId") Long userId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    // Find all records with incomplete subtasks from a date range (for carryover)
    @Query("""
                SELECT dp FROM DailyPerformance dp
                JOIN FETCH dp.user
                LEFT JOIN FETCH dp.plan
                WHERE dp.date BETWEEN :start AND :end
                  AND dp.subtasksIncompleted > :minIncompleted
            """)
    List<DailyPerformance> findByDateBetweenAndSubtasksIncompletedGreaterThan(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            @Param("minIncompleted") Integer minIncompleted);
}
