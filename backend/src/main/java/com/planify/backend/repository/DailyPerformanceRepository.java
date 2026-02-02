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

@Repository
public interface DailyPerformanceRepository
        extends JpaRepository<DailyPerformance,Integer> {

    @Query("""
   select dp from DailyPerformance dp
   join fetch dp.user
   left join fetch dp.plan
   where dp.date between :start and :end
""")
    List<DailyPerformance> findByDateBetweenWithUser(
            @Param("start") LocalDateTime start,
            @Param("end")   LocalDateTime end
    );

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
            @Param("end") LocalDateTime end
    );


}
