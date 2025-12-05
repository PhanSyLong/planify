package com.planify.backend.service;

import com.planify.backend.model.Notification;
import com.planify.backend.model.User;
import com.planify.backend.repository.NotificationRepository;
import com.planify.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PACKAGE, makeFinal = true)
@Service
public class NotificationService {
    NotificationRepository notificationRepository;
    JavaMailSender mailSender;
    UserRepository userRepository;

    public void addNotification(Notification notification) {
        notificationRepository.save(notification);
    }

    public void sendNotification(Integer recipientId, String subject, String body, String type) {
        SimpleMailMessage message = new SimpleMailMessage();
        User recipient = userRepository.findById(recipientId)
                        .orElseThrow(() -> new EntityNotFoundException("Recipient not found"));

        message.setTo(recipient.getEmail());
        message.setSubject(subject);
        message.setText(body);
        message.setFrom("annmk.23bi14003@usth.edu.vn");  //TODO: Setup a proper gmail account for this
        mailSender.send(message);

        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setType(type);
        notification.setMessageText(body);
        notificationRepository.save(notification);
    }

    public List<Notification> getNoficationsByUserId(Integer userId) {
        return notificationRepository.getNotificationsByRecipientId(userId);
    }
}
