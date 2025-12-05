package com.planify.backend.controller;

import com.planify.backend.model.Notification;
import com.planify.backend.service.NotificationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@FieldDefaults(level = AccessLevel.PACKAGE, makeFinal = true)
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/notification")
public class NotificationController {
    NotificationService notificationService;

    @PostMapping("/add")
    public ResponseEntity<?> addNotification(@RequestBody Notification notification) {
        notificationService.addNotification(notification);
        return ResponseEntity.ok(notification);
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendNotification(@RequestParam Integer recipientId, @RequestParam String subject, @RequestParam String body, @RequestParam String type) {
        notificationService.sendNotification(recipientId, subject, body, type);
        return ResponseEntity.ok("To " + recipientId + ": "+ subject);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Notification>> getNotificationsByUserId(@PathVariable Integer userId) {
        List<Notification> notifications = notificationService.getNoficationsByUserId(userId);
        return ResponseEntity.ok(notifications);
    }
}
