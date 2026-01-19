package com.planify.backend.service;

import com.planify.backend.constant.NotificationTypeConst;
import com.planify.backend.dto.request.NotificationRequest;
import com.planify.backend.model.Plan;
import com.planify.backend.model.User;
import com.planify.backend.repository.PlanRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)

public class DealineReminderService {

    final PlanRepository planRepository;
    final NotificationService notificationService;

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void scan() {

        // Create Authentication with role ADMIN
        var auth = new UsernamePasswordAuthenticationToken(
                "system",
                null,
                List.of(new SimpleGrantedAuthority("SCOPE_ADMIN"))
        );
        SecurityContextHolder.getContext().setAuthentication(auth);

        try {
            LocalDateTime now = LocalDateTime.now();

            // ============================Find reminder Plan==================================
            List<Plan> reminders = planRepository.findRemindersPlanWithDetails(now);
            for (Plan plan : reminders) {
                User recipient = plan.getOwner();

                // Create REQUEST DTO
                NotificationRequest notificationRequest = NotificationRequest.builder()
                        .recipientId(recipient.getId())
                        .type(NotificationTypeConst.PLAN_REMINDER)
                        .messageText(
                                "The deadline for plan \"" + plan.getTitle() + "\" is coming up"
                        )
                        .planId(plan.getId())
                        .time(plan.getExpiredAt())
                        .build();

                // Send Mail
                notificationService.sendEmailNotification(
                        notificationRequest,
                        plan,
                        "PLAN DEADLINE REMINDER"
                );
                notificationService.sendWebNotification(
                        notificationRequest,
                        "PLAN DEADLINE REMINDER"
                );

                plan.setReminderSent(true);
            }

            // ==============================Find expired Plan===============================================
            List<Plan> duePlans = planRepository.findDuePlansWithDetails(now);
            for (Plan plan : duePlans) {
                Plan managedPlan = planRepository.findById(plan.getId())
                        .orElseThrow(() -> new RuntimeException("Plan not found"));
                User recipient = managedPlan.getOwner();
                // Create REQUEST DTO
                NotificationRequest notificationRequest = NotificationRequest.builder()
                        .recipientId(recipient.getId()) // USER ID
                        .type(NotificationTypeConst.PLAN_EXPIRED)
                        .messageText(
                                "The deadline for plan \"" + plan.getDescription() + "\" is expired"
                        )
                        .planId(plan.getId())
                        .time(plan.getExpiredAt())
                        .build();
                // Send Mail
                notificationService.sendEmailNotification(
                        notificationRequest,
                        plan,
                        "PLAN IS EXPIRED" //
                );
                notificationService.sendWebNotification(
                        notificationRequest,
                        "PLAN IS EXPIRED" //
                );
                plan.setExpiredSent(true);
            }

            planRepository.saveAll(reminders);
            planRepository.saveAll(duePlans);

        } finally {
            SecurityContextHolder.clearContext();  // Delete Authentication when task done
        }
    }
}


