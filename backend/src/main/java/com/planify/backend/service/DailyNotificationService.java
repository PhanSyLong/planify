package com.planify.backend.service;

import com.planify.backend.constant.NotificationTypeConst;
import com.planify.backend.dto.request.NotificationRequest;
import com.planify.backend.model.DailyPerformance;
import com.planify.backend.model.User;
import com.planify.backend.repository.DailyPerformanceRepository;
import com.planify.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
@RequiredArgsConstructor
public class DailyNotificationService {

    final NotificationService notificationService;
    final UserRepository userRepository;
    final DailyPerformanceRepository dailyPerformanceRepository;

    @Scheduled(cron = "0 55 13,23 * * ?")
    @Transactional
    public void scan() {

        // 1. Create Authentication with role ADMIN
        var auth = new UsernamePasswordAuthenticationToken(
                "system",
                null,
                List.of(new SimpleGrantedAuthority("SCOPE_ADMIN"))
        );
        SecurityContextHolder.getContext().setAuthentication(auth);

        try {
            // 2. Determine duration in a day
            LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
            LocalDateTime endOfDay   = LocalDate.now().atTime(23, 59, 59);

            // 3. Take all the daily_Performance in a day
            List<DailyPerformance> todayPerformances =
                    dailyPerformanceRepository.findByDateBetweenWithUser(startOfDay, endOfDay);

            // 4. Sent notification for each record
            for (DailyPerformance daily : todayPerformances) {
                // Find recipient by ID
                User recipient = userRepository.findById(
                        daily.getUser().getId()
                ).orElseThrow(() -> new EntityNotFoundException("Recipient not found"));


                // Create REQUEST DTO
                NotificationRequest notificationRequest = NotificationRequest.builder()
                        .recipientId(recipient.getId()) // USER ID
                        .type(NotificationTypeConst.DAILY_PERFORMANCE)
                        .messageText(
                                "In plan \"" + daily.getPlan().getTitle()  +
                                        "\" You have " + daily.getTaskEarly() + " TaskEarly | " +
                                        daily.getTaskLate() + " TaskLate |" +
                                        daily.getTaskOntime() + " TaskOntime |" +
                                        daily.getSubtasksCompleted() + " TaskComplete |" +
                                        daily.getSubtasksIncompleted() + " TaskIncomplete |" +
                                        daily.getSubtasksCancelled() + " TaskCancelled |"
                        )
                        .planId(daily.getPlan().getId())
                        .time(daily.getDate())
                        .build();

                // Send Mail
                notificationService.sendEmailDailyPerformance(
                        notificationRequest,
                        daily,
                        "DailyPerformance"
                );
                // Send to Account
                notificationService.sendWebDailyPerformance(
                        notificationRequest,
                        daily,
                        "DailyPerformance"
                );
            }

        } finally {
            SecurityContextHolder.clearContext();
        }
    }
}
