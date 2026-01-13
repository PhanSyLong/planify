package com.planify.backend.service;

import com.planify.backend.dto.request.NotificationRequest;
import com.planify.backend.mapper.NotificationMapper;
import com.planify.backend.model.DailyPerformance;
import com.planify.backend.model.Notification;
import com.planify.backend.model.Plan;
import com.planify.backend.model.User;
import com.planify.backend.repository.NotificationRepository;
import com.planify.backend.repository.PlanRepository;
import com.planify.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Service
public class NotificationService {
    final Map<Long, List<SseEmitter>> emitters = new ConcurrentHashMap<>();

    final PlanRepository  planRepository;
    final NotificationMapper  notificationMapper;
    final NotificationRepository notificationRepository;
    final JavaMailSender mailSender;
    final UserRepository userRepository;
    @Value("${spring.mail.username}")
    String gmailAddress;
    final JwtUserContext jwtUserContext;

    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public Notification addNotification(NotificationRequest request) {
        Notification notification = new Notification();
        notification.setType(request.getType());
        notification.setMessageText(request.getMessageText());
        notification.setRecipient(userRepository.findById(request.getRecipientId())
                .orElseThrow(() -> new RuntimeException("Recipient not found")));

        return notificationRepository.save(notification);
    }

    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public Notification sendEmailNotification(NotificationRequest request, Plan plan, String subject) {
        Notification notification = new Notification();
        notification.setType(request.getType());
        notification.setMessageText(request.getMessageText());
        notification.setTime(request.getTime());
        User recipient = userRepository.findById(request.getRecipientId())
                .orElseThrow(() -> new EntityNotFoundException("Recipient not found"));

        notification.setRecipient(recipient);
        if (plan != null){
            notification.setPlan(plan);
        }
        if (recipient.getNotification_enabled().equals("false")){
            return notificationRepository.save(notification);
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(recipient.getEmail());
        message.setSubject(subject);
        message.setText(request.getMessageText());
        message.setFrom(gmailAddress);
        mailSender.send(message);

        return notificationRepository.save(notification);
    }
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public Notification sendWebNotification(NotificationRequest request,String subject) {

        User recipient = userRepository.findById(request.getRecipientId())
                .orElseThrow(() -> new EntityNotFoundException("Recipient not found"));

        Notification notification = new Notification();
        notification.setTime(request.getTime());
        notification.setType(request.getType());
        notification.setMessageText(request.getMessageText());
        notification.setRecipient(recipient);
        Plan plan = planRepository.findById(request.getPlanId())
                .orElseThrow(() -> new RuntimeException("Plan not found"));

        notification.setPlan(plan);

        Notification saved = notificationRepository.save(notification);

        //  PUSH REALTIME (DTO)
        send(
                recipient.getId().longValue(),
                notificationMapper.toResponse(saved)
        );

        return saved;
    }
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public Notification sendEmailDailyPerformance(NotificationRequest request, DailyPerformance dailyPerformance, String subject) {
        Notification notification = new Notification();
        notification.setType(request.getType());
        notification.setMessageText(request.getMessageText());
        notification.setTime(request.getTime());
        notification.setPlan(dailyPerformance.getPlan());
        User recipient = userRepository.findById(request.getRecipientId())
                .orElseThrow(() -> new EntityNotFoundException("Recipient not found"));

        notification.setRecipient(recipient);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(recipient.getEmail());
        message.setSubject(subject);
        message.setText(request.getMessageText());
        message.setFrom(gmailAddress);
        mailSender.send(message);

        return notificationRepository.save(notification);
    }

    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public Notification sendWebDailyPerformance(NotificationRequest request,DailyPerformance dailyPerformance,String subject) {

        User recipient = userRepository.findById(request.getRecipientId())
                .orElseThrow(() -> new EntityNotFoundException("Recipient not found"));

        Notification notification = new Notification();
        notification.setTime(request.getTime());
        notification.setType(request.getType());
        notification.setMessageText(request.getMessageText());
        notification.setPlan(dailyPerformance.getPlan());
        notification.setRecipient(recipient);
        Plan plan = planRepository.findById(request.getPlanId())
                .orElseThrow(() -> new RuntimeException("Plan not found"));

        notification.setPlan(plan);

        Notification saved = notificationRepository.save(notification);

        //  PUSH REALTIME (DTO)
        send(
                recipient.getId().longValue(),
                notificationMapper.toResponse(saved)
        );

        return saved;
    }

    // =======================================SSE======================================================
    public SseEmitter subscribe(Long userId) {
        SseEmitter emitter = new SseEmitter(0L);

        emitters.computeIfAbsent(userId, k -> new CopyOnWriteArrayList<>())
                .add(emitter);

        emitter.onCompletion(() -> removeEmitter(userId, emitter));
        emitter.onTimeout(() -> removeEmitter(userId, emitter));
        emitter.onError(e -> removeEmitter(userId, emitter));

        return emitter;
    }

    public void send(Long userId, Object data) {
        List<SseEmitter> userEmitters = emitters.get(userId);
        if (userEmitters == null) return;

        for (SseEmitter emitter : userEmitters) {
            try {
                emitter.send(
                        SseEmitter.event()
                                .name("notification")
                                .data(data)
                );
            } catch (IOException e) {
                removeEmitter(userId, emitter);
            }
        }
    }

    private void removeEmitter(Long userId, SseEmitter emitter) {
        List<SseEmitter> list = emitters.get(userId);
        if (list != null) {
            list.remove(emitter);
        }
    }
    // ========================================================================================


    public List<Notification> getNotificationsByUserId(Integer userId) {
        boolean isUser = userId.equals(jwtUserContext.getCurrentUserId());
        if (!isUser && !jwtUserContext.isCurrentUserAdmin()){
            throw new AccessDeniedException("You are not allowed to access these notifications");
        }

        return notificationRepository.getNotificationsByRecipientId(userId);
    }

    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public void deleteNotificationById(Integer notificationId) {
        notificationRepository.deleteById(notificationId);
    }
}
