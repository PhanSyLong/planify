package com.planify.backend.service;

import com.planify.backend.dto.request.NotificationRequest;
import com.planify.backend.model.Notification;
import com.planify.backend.model.User;
import com.planify.backend.repository.NotificationRepository;
import com.planify.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PACKAGE)
@Service
public class NotificationService {
    final NotificationRepository notificationRepository;
    JavaMailSender mailSender;
    final UserRepository userRepository;
    @Value("${spring.mail.username}")
    String gmailAddress;

    public Notification addNotification(NotificationRequest request) {
        Notification notification = new Notification();
        notification.setType(request.getType());
        notification.setMessageText(request.getMessageText());
        notification.setRecipient(userRepository.findById(request.getRecipientId())
                .orElseThrow(() -> new RuntimeException("Recipient not found")));

        return notificationRepository.save(notification);
    }

    public Notification sendEmailNotification(NotificationRequest request, String subject) {
        Notification notification = new Notification();
        notification.setType(request.getType());
        notification.setMessageText(request.getMessageText());
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

    public List<Notification> getNotificationsByUserId(Integer userId) {
        return notificationRepository.getNotificationsByRecipientId(userId);
    }
}
