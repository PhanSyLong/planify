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
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@Slf4j
@FieldDefaults(level = AccessLevel.PACKAGE, makeFinal = true)
@RequiredArgsConstructor
@RestController
@RequestMapping
public class NotificationController {
    NotificationService notificationService;
    NotificationMapper notificationMapper;

    @PostMapping("/notifications")
    ResponseEntity<ApiResponse<NotificationResponse>> addNotification(@RequestBody NotificationRequest request) {
        Notification notif = notificationService.addNotification(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<NotificationResponse>builder()
                        .code(HttpStatus.CREATED.value())
                        .message("Notification has been successfully added")
                        .result(notificationMapper.toResponse(notif))
                        .build());
    }

    @PostMapping("/notifications/send")
    ResponseEntity<ApiResponse<NotificationResponse>> sendEmailNotification(@RequestBody NotificationRequest request, @RequestParam String title) {
        Notification notif = notificationService.sendEmailNotification(request, null, title);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<NotificationResponse>builder()
                        .code(HttpStatus.CREATED.value())
                        .message("Notification has been successfully sent")
                        .result(notificationMapper.toResponse(notif))
                        .build());
    }

    @GetMapping("users/{userId}/notifications")
    ResponseEntity<ApiResponse<List<NotificationResponse>>> getNotificationsByUserId(@PathVariable Integer userId) {
        List<Notification> notifs = notificationService.getNotificationsByUserId(userId);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<List<NotificationResponse>>builder()
                        .code(HttpStatus.OK.value())
                        .result(notificationMapper.toResponseList(notifs))
                        .build());
    }

    @DeleteMapping("/notifications/{notifId}")
    ResponseEntity<ApiResponse<Void>> deleteNotification(@PathVariable Integer notifId) {
        notificationService.deleteNotificationById(notifId);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<Void>builder()
                        .code(HttpStatus.OK.value())
                        .message("Notification removed successfully")
                        .build());
    }
    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter stream(@AuthenticationPrincipal Jwt jwt) {
        Long userId = jwt.getClaim("userId");
        return notificationService.subscribe(userId);
    }

//    @PostMapping("/notifications/web")
//    public ResponseEntity<ApiResponse<NotificationResponse>> sendWebNotification(
//            @RequestBody NotificationRequest request
//    ) {
//        Notification notif = notificationService.sendWebNotification(request);
//
//        return ResponseEntity.ok(
//                ApiResponse.<NotificationResponse>builder()
//                        .code(200)
//                        .result(notificationMapper.toResponse(notif))
//                        .build()
//        );
//    }

}
