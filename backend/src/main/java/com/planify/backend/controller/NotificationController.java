package com.planify.backend.controller;

import com.planify.backend.dto.request.NotificationRequest;
import com.planify.backend.dto.response.ApiResponse;
import com.planify.backend.dto.response.NotificationResponse;
import com.planify.backend.mapper.NotificationMapper;
import com.planify.backend.model.Notification;
import com.planify.backend.service.NotificationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@FieldDefaults(level = AccessLevel.PACKAGE, makeFinal = true)
@RequiredArgsConstructor
@RestController
@RequestMapping("/notification")
public class NotificationController {
    NotificationService notificationService;
    NotificationMapper notificationMapper;

    @PostMapping("/add")
    ResponseEntity<ApiResponse<NotificationResponse>> addNotification(@RequestBody NotificationRequest request) {
        Notification notif = notificationService.addNotification(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<NotificationResponse>builder()
                        .code(HttpStatus.CREATED.value())
                        .message("Notification has been successfully added")
                        .result(notificationMapper.toResponse(notif))
                        .build());
    }

    @PostMapping("/send")
    ResponseEntity<ApiResponse<NotificationResponse>> sendEmailNotification(@RequestBody NotificationRequest request, @RequestParam String title) {
        Notification notif = notificationService.sendEmailNotification(request, title);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<NotificationResponse>builder()
                        .code(HttpStatus.CREATED.value())
                        .message("Notification has been successfully sent")
                        .result(notificationMapper.toResponse(notif))
                        .build());
    }

    @GetMapping("/{userId}")
    ResponseEntity<ApiResponse<List<NotificationResponse>>> getNotificationsByUserId(@PathVariable Integer userId) {
        List<Notification> notifs = notificationService.getNotificationsByUserId(userId);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<List<NotificationResponse>>builder()
                        .code(HttpStatus.OK.value())
                        .result(notificationMapper.toResponseList(notifs))
                        .build());
    }
}
