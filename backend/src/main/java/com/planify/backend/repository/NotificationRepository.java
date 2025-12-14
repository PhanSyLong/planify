package com.planify.backend.repository;

import com.planify.backend.model.Notification;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<@NonNull Notification, @NonNull Integer> {
    List<Notification> getNotificationByRecipientId(Integer userId);
}
