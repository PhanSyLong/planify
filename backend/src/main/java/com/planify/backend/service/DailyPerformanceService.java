package com.planify.backend.service;

import com.planify.backend.dto.response.DailyPerformanceResponse;
import com.planify.backend.model.DailyPerformance;
import com.planify.backend.model.Plan;
import com.planify.backend.model.User;
import com.planify.backend.repository.DailyPerformanceRepository;
import com.planify.backend.repository.PlanRepository;
import com.planify.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class DailyPerformanceService {

    DailyPerformanceRepository dailyPerformanceRepository;
    UserRepository userRepository;
    PlanRepository planRepository;

    /**
     * Called when user clicks "Start" on a subtask.
     * Creates a new record or increments subtasks_incompleted.
     */
    @Transactional
    public void recordSubtaskStart(Long userId, Integer planId) {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(23, 59, 59);

        Optional<DailyPerformance> existing = dailyPerformanceRepository
                .findByUserIdAndPlanIdAndDateBetween(userId, planId, startOfDay, endOfDay);

        if (existing.isPresent()) {
            DailyPerformance dp = existing.get();
            dp.setSubtasksIncompleted(dp.getSubtasksIncompleted() + 1);
            dailyPerformanceRepository.save(dp);
        } else {
            User user = userRepository.findById(userId.intValue())
                    .orElseThrow(() -> new EntityNotFoundException("User not found"));
            Plan plan = planRepository.findById(planId)
                    .orElseThrow(() -> new EntityNotFoundException("Plan not found"));

            DailyPerformance dp = new DailyPerformance();
            dp.setUser(user);
            dp.setPlan(plan);
            dp.setDate(LocalDateTime.now());
            dp.setSubtasksIncompleted(1);
            dp.setSubtasksCompleted(0);
            dp.setSubtasksCancelled(0);
            dp.setTaskEarly(0);
            dp.setTaskLate(0);
            dp.setTaskOntime(0);
            dp.setDurationChanges(0);
            dailyPerformanceRepository.save(dp);
        }
    }

    /**
     * Called when user clicks "Done" on a subtask.
     * Decrements subtasks_incompleted and increments subtasks_completed.
     */
    @Transactional
    public void recordSubtaskDone(Long userId, Integer planId) {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(23, 59, 59);

        Optional<DailyPerformance> existing = dailyPerformanceRepository
                .findByUserIdAndPlanIdAndDateBetween(userId, planId, startOfDay, endOfDay);

        if (existing.isPresent()) {
            DailyPerformance dp = existing.get();
            dp.setSubtasksIncompleted(Math.max(0, dp.getSubtasksIncompleted() - 1));
            dp.setSubtasksCompleted(dp.getSubtasksCompleted() + 1);
            dailyPerformanceRepository.save(dp);
        } else {
            log.warn("No daily performance record found for user {} and plan {} today", userId, planId);
        }
    }

    /**
     * Called when user clicks "Cancel" on a subtask.
     * Decrements subtasks_incompleted and increments subtasks_cancelled.
     */
    @Transactional
    public void recordSubtaskCancel(Long userId, Integer planId) {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(23, 59, 59);

        Optional<DailyPerformance> existing = dailyPerformanceRepository
                .findByUserIdAndPlanIdAndDateBetween(userId, planId, startOfDay, endOfDay);

        if (existing.isPresent()) {
            DailyPerformance dp = existing.get();
            dp.setSubtasksIncompleted(Math.max(0, dp.getSubtasksIncompleted() - 1));
            dp.setSubtasksCancelled(dp.getSubtasksCancelled() + 1);
            dailyPerformanceRepository.save(dp);
        } else {
            log.warn("No daily performance record found for user {} and plan {} today", userId, planId);
        }
    }

    /**
     * Get weekly performance data for WeeklyChart.
     */
    public List<DailyPerformanceResponse> getWeeklyPerformance(Long userId, LocalDate startDate, LocalDate endDate) {
        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atTime(23, 59, 59);
        return dailyPerformanceRepository.getWeeklySummary(userId, start, end);
    }

    /**
     * Scheduled job to carry over incomplete subtasks to the next day.
     * Runs at 00:01 daily.
     */
    @Scheduled(cron = "0 1 0 * * ?")
    @Transactional
    public void carryOverIncompleteSubtasks() {
        log.info("Running daily carryover job for incomplete subtasks");

        LocalDate yesterday = LocalDate.now().minusDays(1);
        LocalDateTime yesterdayStart = yesterday.atStartOfDay();
        LocalDateTime yesterdayEnd = yesterday.atTime(23, 59, 59);

        LocalDateTime todayStart = LocalDate.now().atStartOfDay();
        LocalDateTime todayEnd = LocalDate.now().atTime(23, 59, 59);

        List<DailyPerformance> yesterdayRecords = dailyPerformanceRepository
                .findByDateBetweenAndSubtasksIncompletedGreaterThan(yesterdayStart, yesterdayEnd, 0);

        for (DailyPerformance yesterdayRecord : yesterdayRecords) {
            Integer userId = yesterdayRecord.getUser().getId();
            Integer planId = yesterdayRecord.getPlan() != null ? yesterdayRecord.getPlan().getId() : null;

            if (planId == null)
                continue;

            Optional<DailyPerformance> todayExisting = dailyPerformanceRepository
                    .findByUserIdAndPlanIdAndDateBetween(userId.longValue(), planId, todayStart, todayEnd);

            if (todayExisting.isPresent()) {
                DailyPerformance todayRecord = todayExisting.get();
                todayRecord.setSubtasksIncompleted(
                        todayRecord.getSubtasksIncompleted() + yesterdayRecord.getSubtasksIncompleted());
                dailyPerformanceRepository.save(todayRecord);
            } else {
                DailyPerformance newRecord = new DailyPerformance();
                newRecord.setUser(yesterdayRecord.getUser());
                newRecord.setPlan(yesterdayRecord.getPlan());
                newRecord.setDate(LocalDateTime.now());
                newRecord.setSubtasksIncompleted(yesterdayRecord.getSubtasksIncompleted());
                newRecord.setSubtasksCompleted(0);
                newRecord.setSubtasksCancelled(0);
                newRecord.setTaskEarly(0);
                newRecord.setTaskLate(0);
                newRecord.setTaskOntime(0);
                newRecord.setDurationChanges(0);
                dailyPerformanceRepository.save(newRecord);
            }
        }

        log.info("Carryover completed for {} records", yesterdayRecords.size());
    }
}
