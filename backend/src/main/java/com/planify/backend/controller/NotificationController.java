package com.planify.backend.controller;

import com.planify.backend.dto.request.NotificationRequest;
import com.planify.backend.dto.response.ApiResponse;
import com.planify.backend.dto.response.DailyPerformanceResponse;
import com.planify.backend.dto.response.NotificationResponse;
import com.planify.backend.mapper.NotificationMapper;
import com.planify.backend.model.Notification;
import com.planify.backend.service.DailyNotificationService;
import com.planify.backend.service.DailyPerformanceService;
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

import java.time.LocalDate;
import java.util.List;

@Slf4j
@FieldDefaults(level = AccessLevel.PACKAGE, makeFinal = true)
@RequiredArgsConstructor
@RestController
@RequestMapping
public class NotificationController {
    NotificationService notificationService;
    NotificationMapper notificationMapper;
    DailyNotificationService dailyNotificationService;
    DailyPerformanceService dailyPerformanceService;

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
    ResponseEntity<ApiResponse<NotificationResponse>> sendEmailNotification(@RequestBody NotificationRequest request,
            @RequestParam String title) {
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

    @GetMapping(value = "/notifications/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter stream(@AuthenticationPrincipal Jwt jwt) {
        Long userId = jwt.getClaim("userId");
        return notificationService.subscribe(userId);
    }

    @GetMapping("/daily-performance/today")
    public DailyPerformanceResponse getToday(@AuthenticationPrincipal Jwt jwt) {
        Long userId = jwt.getClaim("userId");
        return dailyNotificationService.getToday(userId);
    }

    @PostMapping("/daily-performance/start")
    public ResponseEntity<?> recordSubtaskStart(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam Integer planId) {
        Long userId = jwt.getClaim("userId");
        dailyPerformanceService.recordSubtaskStart(userId, planId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/daily-performance/done")
    public ResponseEntity<?> recordSubtaskDone(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam Integer planId) {
        Long userId = jwt.getClaim("userId");
        dailyPerformanceService.recordSubtaskDone(userId, planId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/daily-performance/cancel")
    public ResponseEntity<?> recordSubtaskCancel(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam Integer planId) {
        Long userId = jwt.getClaim("userId");
        dailyPerformanceService.recordSubtaskCancel(userId, planId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/daily-performance/weekly")
    public List<DailyPerformanceResponse> getWeeklyPerformance(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        Long userId = jwt.getClaim("userId");
        return dailyPerformanceService.getWeeklyPerformance(
                userId,
                LocalDate.parse(startDate),
                LocalDate.parse(endDate));
    }

}
