package com.planify.backend.mapper;

import com.planify.backend.dto.response.NotificationResponse;
import com.planify.backend.model.Notification;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface NotificationMapper {
    @Mapping(source = "recipient.id", target = "recipientId")
    @Mapping(source = "plan.id", target = "planId")
    @Mapping(source = "plan.title", target = "title")
    NotificationResponse toResponse(Notification notification);
    @Mapping(source = "recipient.id", target = "recipientId")
    List<NotificationResponse> toResponseList(List<Notification> notifications);
}
