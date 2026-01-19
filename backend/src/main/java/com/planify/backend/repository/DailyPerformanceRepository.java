package com.planify.backend.repository;

import com.planify.backend.model.DailyPerformance;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

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


}
