package com.planify.backend.service;

import com.planify.backend.constant.NotificationTypeConst;
import com.planify.backend.dto.request.NotificationRequest;
import com.planify.backend.model.*;
import com.planify.backend.repository.SubtaskRepository;
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

    final SubtaskRepository  subtaskRepository;
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
            LocalDateTime from = now.plusHours(7);
            LocalDateTime to   = from.plusMinutes(1);

            // ============================Find reminder Plan==================================
            List<Subtask> subTasks =
                    subtaskRepository.findSubTasksToRemind(from, to);

            for (Subtask st : subTasks) {

                Task task = st.getTask_id();
                Stage stage = task.getStage_id();
                Plan plan = stage.getPlan_id();
                User user = plan.getOwner();

                NotificationRequest req = NotificationRequest.builder()
                        .recipientId(user.getId())
                        .type(NotificationTypeConst.PLAN_EXPIRED)
                        .messageText(
                                "Subtask \"" + st.getTitle() + "\" " + " will expired tomorow"
                        )
                        .planId(plan.getId())
                        .time(st.getScheduledDate())
                        .build();

                notificationService.sendWebNotification(req, "SUBTASK REMINDER");
                notificationService.sendEmailNotification(req, plan, "SUBTASK REMINDER");

                st.setScheduledSent(true);
            }

            subtaskRepository.saveAll(subTasks);

        } finally {
            SecurityContextHolder.clearContext();
        }
    }
}


